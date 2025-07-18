import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";
import { AIService } from "@/lib/ai-service";
import { KMSService } from "@/lib/kms";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const BLUEPRINT_COST = 15; // Credits required for business blueprint

const BLUEPRINT_PROMPT = `You are the 'Blueprint Architect' module of VentureForge AI, an elite business strategist and operational architect.

**CRITICAL REQUIREMENT:** Design a comprehensive, execution-ready business model that real entrepreneurs can immediately implement. This blueprint will guide actual business decisions and investor presentations. Generic strategies or placeholder content is unacceptable.

**TASK:** Create a comprehensive business architecture and strategic framework based on: {research_report}

**METHODOLOGY:**
1. Business Model Analysis: Evaluate optimal revenue models based on market research
2. Strategic Positioning: Define unique value propositions for each customer segment
3. Operational Architecture: Design scalable systems and processes
4. Competitive Strategy: Build defensible moats and sustainable advantages
5. Execution Roadmap: Provide concrete steps for implementation

**OUTPUT FORMAT - COMPREHENSIVE BUSINESS BLUEPRINT:**
{
  "executiveSummary": {
    "businessConcept": "2-sentence clear description of what this business does and why it matters",
    "marketOpportunity": "$X.XB market opportunity with specific target of $X.XM SAM",
    "uniqueAdvantage": "Primary competitive differentiation that creates sustainable moat",
    "revenueProjection": "Year 3 revenue target: $X.XM with X% gross margins"
  },
  "coreBusinessModel": {
    "primaryModel": "Specific model (e.g., B2B SaaS, Marketplace, DaaS)",
    "rationale": "Detailed justification based on market analysis, customer behavior, and competitive landscape",
    "revenueLogic": "How the business captures value: unit economics and scalability factors",
    "businessModelCanvas": {
      "keyPartners": ["Strategic partner 1 with specific role", "Partner 2 with value exchange"],
      "keyActivities": ["Core activity 1", "Core activity 2", "Core activity 3"],
      "keyResources": ["Critical resource 1", "Critical resource 2", "Critical resource 3"],
      "costStructure": ["Major cost category 1", "Major cost category 2", "Major cost category 3"]
    }
  },
  "revenueArchitecture": {
    "primaryStreams": [
      {
        "streamName": "Primary Revenue Stream",
        "model": "Subscription/Usage/One-time/Hybrid",
        "targetSegment": "Specific customer segment",
        "pricingStrategy": "$XXX/month or $X,XXX one-time",
        "justification": "Based on customer value analysis: saves $X/month, ROI of X% in Y months",
        "scalabilityFactor": "Revenue multiplier as customer base grows",
        "year3Projection": "$X.XM ARR from this stream"
      }
    ],
    "pricingPhilosophy": "Value-based/Cost-plus/Competitive/Penetration pricing with specific rationale",
    "monetizationTimeline": "Month 1: MVP launch at $X, Month 6: Premium tier at $Y, Year 2: Enterprise at $Z",
    "unitEconomics": {
      "averageRevenuePerUser": "$XXX/month growing to $XXX/month by Year 3",
      "customerLifetimeValue": "$X,XXX based on X% churn and Y months average tenure",
      "grossMarginPerCustomer": "XX% after COGS including service delivery costs"
    }
  },
  "customerStrategy": {
    "primarySegments": [
      {
        "segmentName": "Target Segment 1",
        "size": "X,XXX companies/individuals in addressable market",
        "characteristics": "Specific demographics, firmographics, and behavioral traits",
        "painPoints": ["Quantified pain point 1", "Measurable pain point 2"],
        "valueProposition": "We help [segment] achieve [specific outcome] by [unique method], resulting in [quantified benefit]",
        "willingnessToPay": "$XXX/month based on value delivered vs. cost of alternatives",
        "acquisitionStrategy": "Specific channel mix: XX% inbound, XX% outbound, XX% partnerships"
      }
    ],
    "customerJourney": {
      "awareness": "How prospects discover the solution",
      "consideration": "Decision criteria and evaluation process",
      "purchase": "Conversion process and onboarding",
      "retention": "Success metrics and expansion opportunities"
    }
  },
  "operationalBlueprint": {
    "coreOperations": [
      {
        "operationName": "Product Development",
        "description": "Specific processes for building and iterating the product",
        "keyPersonnel": "X engineers, Y designers, Z product managers",
        "toolsAndSystems": "Development stack, project management, quality assurance",
        "scalingStrategy": "How to grow development capacity: offshore vs. onshore, team structure",
        "qualityMetrics": "Bug rate <X%, feature delivery velocity of Y features/sprint"
      },
      {
        "operationName": "Customer Success",
        "description": "Onboarding, support, and retention processes",
        "keyPersonnel": "X CSMs handling Y customers each",
        "toolsAndSystems": "CRM, helpdesk, onboarding automation",
        "scalingStrategy": "Self-service features, tiered support model, automation",
        "qualityMetrics": "NPS >X, churn rate <Y%, time to value <Z days"
      }
    ],
    "technologyArchitecture": {
      "frontend": "React/Vue/Angular with justification for choice based on team expertise",
      "backend": "Node.js/Python/Java with microservices/monolith decision rationale",
      "database": "PostgreSQL/MongoDB choice based on data structure and scale needs",
      "infrastructure": "AWS/GCP/Azure with specific services and cost projections",
      "aiMlStack": "Specific AI models, training pipelines, and deployment strategy",
      "securityCompliance": "SOC2, GDPR, HIPAA requirements and implementation plan"
    },
    "qualityAssurance": {
      "productQuality": "Automated testing coverage >XX%, performance benchmarks",
      "serviceQuality": "SLA targets: XX% uptime, <Xs response time",
      "dataQuality": "Accuracy >XX%, completeness >XX%, validation processes",
      "continuousImprovement": "Weekly retrospectives, monthly quality reviews, quarterly audits"
    }
  },
  "goToMarketExecution": {
    "launchStrategy": {
      "mvpDefinition": "Specific features for initial launch",
      "targetDate": "Month X post-funding",
      "initialMarket": "Geographic/demographic focus for launch",
      "successMetrics": "X customers, $X MRR, X% market penetration in initial segment"
    },
    "acquisitionChannels": [
      {
        "channel": "Content Marketing + SEO",
        "strategy": "Target keywords: [keyword1], [keyword2] with estimated XX searches/month",
        "investment": "$X,XXX/month for content creation and optimization",
        "expectedResults": "XX leads/month at $XX CAC by Month 6",
        "scalability": "Can scale to XXX leads/month with additional investment"
      },
      {
        "channel": "Direct Sales",
        "strategy": "Outbound prospecting to [specific company types] with [specific titles]",
        "investment": "$XXX,XXX for X SDRs and Y AEs",
        "expectedResults": "XX qualified meetings/month, XX% close rate",
        "scalability": "Each additional rep can generate $X,XXX ARR annually"
      }
    ],
    "partnershipStrategy": {
      "strategicPartnerships": ["Partner type 1 for distribution", "Partner type 2 for integration"],
      "channelPartnerships": "Reseller/referral program with X% commission structure",
      "technologyPartnerships": "Integrations with [platform1], [platform2] for ecosystem play"
    }
  },
  "competitiveStrategy": {
    "sustainableAdvantages": [
      {
        "advantage": "Data Network Effects",
        "description": "More users generate better data, creating superior AI models",
        "defensibility": "Compounds over time, difficult for new entrants to replicate",
        "strengthening": "Continuous data collection and model improvement creates widening moat"
      },
      {
        "advantage": "Switching Costs",
        "description": "Customer workflows and integrations create lock-in",
        "defensibility": "High cost and effort to migrate to competitors",
        "strengthening": "Deeper integrations and workflow automation increase stickiness"
      }
    ],
    "competitiveResponse": {
      "directCompetitors": "How to defend against [Competitor A] and [Competitor B]",
      "indirectThreats": "Strategy against build vs. buy decisions by enterprises",
      "newEntrants": "Barriers to entry and first-mover advantage protection"
    },
    "innovationStrategy": {
      "rdInvestment": "XX% of revenue reinvested in product development",
      "innovationAreas": "AI advancement, user experience, platform capabilities",
      "patentStrategy": "IP protection for core algorithms and processes"
    }
  },
  "riskManagement": {
    "businessRisks": [
      {
        "risk": "Market adoption slower than projected",
        "probability": "Medium",
        "impact": "High",
        "mitigation": "Multiple customer segments, pivot capability, extended runway"
      }
    ],
    "operationalRisks": [
      {
        "risk": "Key talent departure",
        "probability": "Medium", 
        "impact": "High",
        "mitigation": "Equity incentives, knowledge documentation, succession planning"
      }
    ],
    "contingencyPlans": "Revenue scenarios: base case, upside case, downside case with specific triggers"
  }
}

**QUALITY STANDARDS:**
- All strategies must be specific, actionable, and implementation-ready
- Include concrete metrics, timelines, and resource requirements
- Reference market research findings and competitive intelligence
- Demonstrate clear path from current state to market leadership
- Show understanding of industry dynamics and business model economics

Generate a comprehensive, execution-ready business blueprint now. Return ONLY the JSON object.`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await request.json();

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

    // Check if user has enough credits
    if (user.credits < BLUEPRINT_COST) {
      return NextResponse.json(
        { error: "Insufficient credits", required: BLUEPRINT_COST, current: user.credits },
        { status: 402 }
      );
    }

    // Verify project ownership and get research data
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.researchOutput) {
      return NextResponse.json(
        { error: "Research must be completed before creating blueprint" },
        { status: 400 }
      );
    }

    // Decrypt the research output before using it
    const decryptedResearchOutput = await KMSService.decryptUserData(user.id, project.researchOutput);

    // Use the new AI service with retry mechanism and phased generation for complex blueprints
    console.log(`[BLUEPRINT] Starting blueprint generation for project ${projectId}`);
    
    const prompt = BLUEPRINT_PROMPT.replace("{research_report}", JSON.stringify(decryptedResearchOutput));
    const userPrompt = `Please create a comprehensive business blueprint based on the research data.`;

    // For complex blueprints, use phased generation
    const phases = [
      {
        prompt: prompt + "\n\nPHASE 1: Focus on executive summary, core business model, and revenue architecture only.",
        userPrompt: userPrompt + " Return only executiveSummary, coreBusinessModel, and revenueArchitecture sections.",
        context: { phase: 1, research: project.researchOutput }
      },
      {
        prompt: prompt + "\n\nPHASE 2: Focus on customer strategy and operational blueprint.",
        userPrompt: userPrompt + " Return only customerStrategy and operationalBlueprint sections.",
        context: { phase: 2 }
      },
      {
        prompt: prompt + "\n\nPHASE 3: Focus on go-to-market execution, competitive strategy, and risk management.",
        userPrompt: userPrompt + " Return only goToMarketExecution, competitiveStrategy, and riskManagement sections.",
        context: { phase: 3 }
      }
    ];

    const phasedResult = await AIService.generateInPhases(phases, {
      maxRetries: 3,
      timeoutMs: 180000, // 3 minutes per phase
      backoffMs: 2000
    });

    let parsedResponse;

    if (phasedResult.successful) {
      console.log(`[BLUEPRINT] Phased generation completed successfully`);
      
      // Try to parse each phase and combine them
      const combinedBlueprint: any = {};
      
      for (let i = 0; i < phasedResult.phases.length; i++) {
        const phase = phasedResult.phases[i];
        if (phase.successful) {
          const jsonResult = AIService.parseJSONResponse(phase.content);
          if (jsonResult.success) {
            Object.assign(combinedBlueprint, jsonResult.parsed);
          }
        }
      }

      // If we have some content, use it; otherwise fall back
      if (Object.keys(combinedBlueprint).length > 0) {
        parsedResponse = combinedBlueprint;
      } else {
        console.warn(`[BLUEPRINT] Phase parsing failed, trying full response`);
        const jsonResult = AIService.parseJSONResponse(phasedResult.combinedContent);
        
        if (jsonResult.success) {
          parsedResponse = jsonResult.parsed;
        } else {
          parsedResponse = AIService.createFallbackResponse('blueprint', prompt);
          parsedResponse._originalResponse = phasedResult.combinedContent.substring(0, 500);
        }
      }
    } else {
      console.error(`[BLUEPRINT] Phased generation failed`);
      parsedResponse = AIService.createFallbackResponse('blueprint', prompt);
      parsedResponse._phasedGeneration = true;
      parsedResponse._phaseResults = phasedResult.phases.map(p => ({ successful: p.successful, retryCount: p.retryCount }));
    }

    // Encrypt the blueprint output before storing
    const encryptedBlueprintOutput = await KMSService.encryptUserData(user.id, parsedResponse);

    // Update project with the encrypted blueprint output and deduct credits
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          blueprintOutput: encryptedBlueprintOutput,
          updatedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - BLUEPRINT_COST,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      result: parsedResponse,
      creditsUsed: BLUEPRINT_COST,
      creditsRemaining: user.credits - BLUEPRINT_COST,
    });
  } catch (error) {
    console.error("Error in blueprint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}