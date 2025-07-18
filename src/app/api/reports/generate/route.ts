import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReportGenerator, { ReportOptions } from "@/lib/report-generator";

export const maxDuration = 120; // 2 minutes for report generation

export async function POST(request: NextRequest) {
  let requestedFormat = 'html';
  let project: any = null;
  let template: 'executive' | 'investor' | 'comprehensive' | 'pitch-deck' = 'comprehensive';
  let includeCharts = true;
  let branding: any = {};
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = await request.json();
    const { projectId, format, template: reqTemplate, includeCharts: reqIncludeCharts, branding: reqBranding } = requestData;
    
    requestedFormat = format || 'html';
    template = (reqTemplate as 'executive' | 'investor' | 'comprehensive' | 'pitch-deck') || 'comprehensive';
    includeCharts = reqIncludeCharts !== false;
    branding = reqBranding || {};

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify project ownership and get project data
    project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if project has enough content for report generation
    if (!project.ideaOutput) {
      return NextResponse.json(
        { error: "Project must have at least an idea to generate a report" },
        { status: 400 }
      );
    }

    const options: ReportOptions = {
      format: format || 'html',
      template: template || 'comprehensive',
      includeCharts: includeCharts !== false, // Default to true
      branding: branding || {
        primaryColor: '#3B82F6',
        companyName: project.name
      }
    };

    console.log(`[REPORT] Generating ${options.format} report for project ${projectId}`);

    if (options.format === 'pdf') {
      console.log(`[REPORT API] Starting PDF generation for project: ${project.name}`);
      
      const projectData = {
        ...project,
        createdAt: project.createdAt.toISOString()
      };
      
      try {
        const pdfBuffer = await ReportGenerator.generatePDF(projectData, options);
        
        console.log(`[REPORT API] PDF generated successfully, size: ${pdfBuffer.length} bytes`);
        
        // Additional validation
        if (!pdfBuffer || pdfBuffer.length === 0) {
          throw new Error('PDF buffer is empty');
        }
        
        const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, '-')}-business-plan.pdf`;
        console.log(`[REPORT API] Returning PDF with filename: ${filename}`);
        
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': pdfBuffer.length.toString(),
            'Cache-Control': 'no-cache'
          }
        });
      } catch (pdfError) {
        console.error('[REPORT API] PDF generation failed:', pdfError);
        
        // Log project data for debugging
        console.log('[REPORT API] Project data summary:', {
          hasIdea: !!projectData.ideaOutput,
          hasResearch: !!projectData.researchOutput,
          hasBlueprint: !!projectData.blueprintOutput,
          hasFinancials: !!projectData.financialOutput,
          hasPitch: !!projectData.pitchOutput,
          hasGTM: !!projectData.gtmOutput
        });
        
        throw pdfError;
      }
    } else {
      const projectData = {
        ...project,
        createdAt: project.createdAt.toISOString()
      };
      const html = ReportGenerator.generateHTML(projectData, options);
      
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
        }
      });
    }

  } catch (error) {
    console.error("Error generating report:", error);
    
    // If PDF generation fails, try to provide HTML fallback
    if (requestedFormat === 'pdf') {
      try {
        const projectData = {
          ...project,
          createdAt: project.createdAt.toISOString()
        };
        const html = ReportGenerator.generateHTML(projectData, { 
          format: 'html',
          template: template || 'comprehensive',
          includeCharts: includeCharts !== false,
          branding: branding || {
            primaryColor: '#3B82F6',
            companyName: project.name
          }
        });
        
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          }
        });
      } catch (fallbackError) {
        console.error("HTML fallback also failed:", fallbackError);
      }
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate report", 
        details: error instanceof Error ? error.message : "Unknown error",
        note: "PDF generation not available in this environment. Please try HTML format."
      },
      { status: 500 }
    );
  }
}