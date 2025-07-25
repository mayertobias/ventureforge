import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReportGenerator, { ReportOptions } from "@/lib/report-generator";
import { SessionStorageService } from "@/lib/session-storage";

export const maxDuration = 120; // 2 minutes for report generation

export async function POST(request: NextRequest) {
  let requestedFormat = 'html';
  let project: any = null;
  let template: 'executive' | 'investor' | 'comprehensive' | 'pitch-deck' | 'full-comprehensive' = 'comprehensive';
  let includeCharts = true;
  let branding: any = {};
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = await request.json();
    const { projectId, format, template: reqTemplate, includeCharts: reqIncludeCharts, branding: reqBranding, projectData } = requestData;
    
    requestedFormat = format || 'html';
    template = (reqTemplate as 'executive' | 'investor' | 'comprehensive' | 'pitch-deck' | 'full-comprehensive') || 'comprehensive';
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

    // Handle memory-only projects with data sent from client
    if (projectData) {
      // Memory-only project: use data provided by client
      project = {
        id: projectData.id,
        name: projectData.name,
        createdAt: new Date(), // Use current date for memory-only projects
        userId: user.id,
        ideaOutput: projectData.ideaOutput,
        researchOutput: projectData.researchOutput,
        blueprintOutput: projectData.blueprintOutput,
        financialOutput: projectData.financialOutput,
        pitchOutput: projectData.pitchOutput,
        gtmOutput: projectData.gtmOutput,
      };
      console.log(`[REPORT] Using client-provided data for memory-only project ${projectId}`);
    } else {
      // Persistent project: get data from session storage
      const sessionProject = await SessionStorageService.getProjectSession(projectId, user.id);

      if (!sessionProject) {
        return NextResponse.json({ error: "Project not found or expired" }, { status: 404 });
      }

      // Convert session data to expected project format for report generator
      project = {
        id: sessionProject.id,
        name: sessionProject.name,
        createdAt: sessionProject.createdAt,
        userId: sessionProject.userId,
        ideaOutput: sessionProject.data.ideaOutput,
        researchOutput: sessionProject.data.researchOutput,
        blueprintOutput: sessionProject.data.blueprintOutput,
        financialOutput: sessionProject.data.financialOutput,
        pitchOutput: sessionProject.data.pitchOutput,
        gtmOutput: sessionProject.data.gtmOutput,
      };
      console.log(`[REPORT] Using session-stored data for persistent project ${projectId}`);
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

    if (options.format === 'json') {
      console.log(`[REPORT API] Starting JSON export for project: ${project.name}`);
      
      // Generate comprehensive JSON export
      const jsonExport = {
        metadata: {
          projectId: project.id,
          projectName: project.name,
          generatedAt: new Date().toISOString(),
          generatedBy: 'VentureForge AI',
          exportFormat: 'json',
          template: options.template
        },
        businessPlan: {
          idea: project.ideaOutput || null,
          research: project.researchOutput || null,
          blueprint: project.blueprintOutput || null,
          financials: project.financialOutput || null,
          pitch: project.pitchOutput || null,
          gtm: project.gtmOutput || null
        },
        summary: {
          executiveSummary: ReportGenerator.generateExecutiveSummary(project),
          keyMetrics: ReportGenerator.extractFinancialMetrics(project),
          createdDate: project.createdAt
        }
      };
      
      const sanitizedProjectName = project.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
      const filename = `${sanitizedProjectName || 'business-plan'}-${Date.now()}.json`;
      console.log(`[REPORT API] Returning JSON with filename: ${filename}`);
      
      const jsonString = JSON.stringify(jsonExport, null, 2);
      
      return new NextResponse(jsonString, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': jsonString.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else if (options.format === 'pdf') {
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