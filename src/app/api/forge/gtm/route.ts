import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";
import { AIService } from "@/lib/ai-service";

export const maxDuration = 300; // Set timeout to 300 seconds (5 minutes)

const GTM_COST = 10; // Credits required for go-to-market strategy

const GTM_PROMPT = `You are the 'Go-to-Market Strategist' module of VentureForge AI, an elite growth marketing and sales execution expert.

**CRITICAL REQUIREMENT:** Design an execution-ready 6-month GTM strategy that real entrepreneurs can immediately implement to achieve first revenue and product-market fit validation. This strategy will guide actual customer acquisition and revenue generation. Generic tactics or theoretical frameworks are unacceptable.

**TASK:** Create comprehensive, actionable GTM playbook based on: {full_business_plan}

**METHODOLOGY:**
1. Market Entry Strategy: Define specific launch approach and initial customer targets
2. Channel Architecture: Build multi-channel acquisition engine with clear ROI metrics
3. Sales Process Design: Create repeatable sales methodology with conversion optimization
4. Revenue Acceleration: Establish growth levers and scaling mechanisms
5. Performance Measurement: Implement tracking and optimization framework

**OUTPUT FORMAT - EXECUTION-READY GTM STRATEGY:**
{
  "strategicOverview": {
    "gtmThesis": "Core hypothesis about how this business will acquire and retain customers profitably",
    "marketEntryStrategy": "Specific approach to entering the market: land-and-expand, direct assault, niche domination, etc.",
    "primaryObjective": "Main goal for 6-month period: revenue, customer acquisition, market validation, etc.",
    "successMetrics": "Top 3 KPIs that define GTM success",
    "competitivePositioning": "How to position against existing alternatives in the market"
  },
  "customerAcquisitionFramework": {
    "idealCustomerProfile": {
      "primarySegment": "Specific description of ideal customer with demographics/firmographics",
      "customerJobs": "What customers are trying to achieve",
      "painPoints": ["Specific pain point 1", "Quantified pain point 2"],
      "buyingProcess": "How these customers currently make purchasing decisions",
      "budget": "Typical budget range for this type of solution",
      "decisionCriteria": "Top 3 factors customers use to evaluate solutions"
    },
    "acquisitionChannels": [
      {
        "channelName": "Content Marketing + SEO",
        "channelType": "Inbound/Organic",
        "monthlyInvestment": "$X,XXX budget + Y hours/week",
        "implementation": "Specific tactics: blog posts on [topics], target keywords [keyword1, keyword2]",
        "expectedResults": {
          "month1": "X website visitors, Y leads",
          "month3": "X website visitors, Y leads",
          "month6": "X website visitors, Y leads"
        },
        "cac": "$XXX customer acquisition cost",
        "conversionPath": "Visitor → Newsletter → Lead → Demo → Customer",
        "optimizationPlan": "A/B testing approach and improvement strategy"
      },
      {
        "channelName": "LinkedIn Outbound Sales",
        "channelType": "Direct/Outbound",
        "monthlyInvestment": "$X,XXX for sales tools + SDR time",
        "implementation": "Target: [job titles] at [company types], outreach sequence: [message cadence]",
        "expectedResults": {
          "month1": "X prospects contacted, Y meetings booked",
          "month3": "X prospects contacted, Y meetings booked", 
          "month6": "X prospects contacted, Y meetings booked"
        },
        "cac": "$XXX customer acquisition cost",
        "conversionPath": "Prospect → Connect → Conversation → Demo → Proposal → Close",
        "optimizationPlan": "Message testing, targeting refinement, follow-up sequence optimization"
      },
      {
        "channelName": "Strategic Partnerships",
        "channelType": "Channel/Referral",
        "monthlyInvestment": "$X,XXX for partnership development + management time",
        "implementation": "Target partners: [partner type 1], [partner type 2], referral commission: X%",
        "expectedResults": {
          "month1": "X partner agreements signed",
          "month3": "Y referrals generated",
          "month6": "Z customers acquired through partners"
        },
        "cac": "$XXX effective customer acquisition cost including commissions",
        "conversionPath": "Partner → Referral → Warm Introduction → Demo → Close",
        "optimizationPlan": "Partner enablement, referral process optimization, joint marketing"
      }
    ]
  },
  "monthlyExecutionPlan": {
    "month1": {
      "primaryFocus": "Market entry and initial traction",
      "keyActivities": [
        "Launch website and core content marketing",
        "Begin LinkedIn outbound prospecting",
        "Identify and approach first 10 strategic partners"
      ],
      "targetMetrics": {
        "newCustomers": "X paying customers",
        "mrr": "$X,XXX MRR",
        "pipeline": "$X,XXX qualified pipeline",
        "channelMix": "XX% organic, XX% outbound, XX% partnerships"
      },
      "weeklyMilestones": [
        "Week 1: Launch GTM engine and initial outreach",
        "Week 2: First customer demos and partnership meetings",
        "Week 3: First paying customers and content publication",
        "Week 4: Month 1 analysis and Month 2 optimization"
      ]
    },
    "month3": {
      "primaryFocus": "Channel optimization and growth acceleration",
      "keyActivities": [
        "Optimize highest-performing acquisition channels",
        "Scale successful partnerships and content strategies",
        "Implement customer success and expansion programs"
      ],
      "targetMetrics": {
        "newCustomers": "X paying customers (cumulative: Y)",
        "mrr": "$X,XXX MRR",
        "pipeline": "$X,XXX qualified pipeline",
        "customerSuccess": "XX% retention rate, $XXX expansion revenue"
      },
      "criticalMilestones": [
        "Achieve $X,XXX MRR milestone",
        "Establish repeatable sales process",
        "Launch customer referral program"
      ]
    },
    "month6": {
      "primaryFocus": "Scale and sustainable growth",
      "keyActivities": [
        "Scale proven channels with increased investment",
        "Launch advanced marketing automation",
        "Establish sales team and processes for Series A"
      ],
      "targetMetrics": {
        "newCustomers": "X paying customers (cumulative: Y)",
        "mrr": "$X,XXX MRR", 
        "pipeline": "$X,XXX qualified pipeline",
        "efficiency": "CAC < $XXX, LTV:CAC > X:1"
      },
      "preparationForScale": [
        "Hire additional sales and marketing personnel",
        "Implement advanced CRM and marketing automation",
        "Establish processes for 10x scale"
      ]
    }
  },
  "salesPlaybook": {
    "salesProcess": {
      "prospectQualification": "BANT framework: Budget $X+, Authority [titles], Need [specific pain], Timeline [urgency]",
      "discoveryQuestions": ["Question 1 to uncover pain", "Question 2 to quantify impact", "Question 3 to understand budget"],
      "demoStrategy": "Problem-focused demo highlighting specific value props relevant to customer's use case",
      "proposalFormat": "ROI-focused proposal with specific value calculations and implementation timeline",
      "closingTechniques": "Specific objection handling and closing strategies for common scenarios"
    },
    "salesTargets": {
      "month1": {
        "pipeline": "$X,XXX qualified opportunities",
        "closedWon": "$X,XXX ARR",
        "averageDealSize": "$X,XXX",
        "salesCycle": "X days average"
      },
      "month3": {
        "pipeline": "$X,XXX qualified opportunities",
        "closedWon": "$X,XXX ARR (cumulative: $Y,XXX)",
        "averageDealSize": "$X,XXX",
        "salesCycle": "X days average"
      },
      "month6": {
        "pipeline": "$X,XXX qualified opportunities",
        "closedWon": "$X,XXX ARR (cumulative: $Y,XXX)",
        "averageDealSize": "$X,XXX",
        "salesCycle": "X days average"
      }
    },
    "conversionOptimization": {
      "leadQualification": "Improve lead quality through better targeting and qualification",
      "demoConversion": "Optimize demo-to-proposal conversion through better discovery",
      "dealVelocity": "Reduce sales cycle through process improvements and urgency creation"
    }
  },
  "budgetAndInvestment": {
    "totalGtmBudget": "$X,XXX for 6-month period",
    "monthlyAllocation": {
      "month1": "$X,XXX for launch and initial traction",
      "months2-3": "$X,XXX/month for optimization and growth",
      "months4-6": "$X,XXX/month for scaling successful channels"
    },
    "channelInvestment": {
      "contentMarketing": "$X,XXX (XX% of budget) - Content creation, SEO tools, design",
      "salesDevelopment": "$X,XXX (XX% of budget) - Sales tools, prospecting, SDR time",
      "partnerships": "$X,XXX (XX% of budget) - Partnership development, commissions",
      "customerSuccess": "$X,XXX (XX% of budget) - Onboarding, support, expansion"
    },
    "roiProjections": {
      "month6Revenue": "$X,XXX ARR",
      "month6Customers": "X paying customers",
      "blendedCAC": "$XXX average customer acquisition cost",
      "ltvCacRatio": "X:1 lifetime value to CAC ratio",
      "paybackPeriod": "X months to recoup customer acquisition investment"
    }
  },
  "operationalRequirements": {
    "teamStructure": {
      "month1": "Founder + part-time marketing contractor",
      "month3": "Founder + SDR + marketing manager",
      "month6": "Sales manager + 2 SDRs + marketing manager + customer success"
    },
    "toolStack": {
      "crm": "HubSpot/Salesforce for lead management and sales process",
      "marketing": "Marketing automation platform for lead nurturing",
      "sales": "Sales engagement platform for outbound prospecting",
      "analytics": "Analytics tools for performance tracking and optimization"
    },
    "processDocumentation": {
      "salesPlaybook": "Documented sales process with scripts and templates",
      "marketingProcesses": "Content calendar, SEO strategy, social media guidelines",
      "customerOnboarding": "Standardized onboarding process for customer success"
    }
  },
  "riskMitigation": {
    "channelRisks": [
      {
        "risk": "Content marketing fails to generate leads",
        "probability": "Medium",
        "impact": "High",
        "mitigation": "Diversify content types, invest in paid promotion, focus on higher-converting channels"
      },
      {
        "risk": "Outbound prospecting yields low conversion",
        "probability": "Medium",
        "impact": "Medium",
        "mitigation": "A/B testing messaging, better targeting, warm introduction strategy"
      }
    ],
    "contingencyPlans": {
      "underperformance": "If Month 3 revenue < 50% of target: pivot to higher-performing channels, increase outbound activity",
      "overperformance": "If Month 3 revenue > 150% of target: accelerate hiring, increase marketing spend, prepare for scale"
    }
  }
}

**QUALITY STANDARDS:**
- All tactics must be specific, actionable, and implementation-ready
- Include concrete numbers, timelines, and resource requirements
- Reference industry benchmarks and best practices for similar businesses
- Balance ambition with realistic execution given startup constraints
- Provide clear decision frameworks and optimization strategies
- Address common GTM challenges and failure modes proactively

Generate a comprehensive, execution-ready GTM strategy now. Return ONLY the JSON object.`;

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
    if (user.credits < GTM_COST) {
      return NextResponse.json(
        { error: "Insufficient credits", required: GTM_COST, current: user.credits },
        { status: 402 }
      );
    }

    // Verify project ownership and get all data
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.pitchOutput) {
      return NextResponse.json(
        { error: "Investor pitch must be completed before GTM strategy" },
        { status: 400 }
      );
    }

    // Create a summarized business context to reduce token usage
    const ideaOutput = project.ideaOutput as any;
    const researchOutput = project.researchOutput as any;
    const blueprintOutput = project.blueprintOutput as any;
    const financialOutput = project.financialOutput as any;
    const pitchOutput = project.pitchOutput as any;
    
    const businessContext = {
      businessIdea: ideaOutput?.selectedIdea?.title || "Business concept",
      targetMarket: researchOutput?.targetCustomerAnalysis?.primarySegment || "Target market TBD",
      valueProposition: blueprintOutput?.valueProposition?.core || "Value prop TBD",
      revenueModel: blueprintOutput?.revenueStreams?.primary || "Revenue model TBD",
      fundingNeeds: financialOutput?.fundingAnalysis?.seedFunding || "Funding TBD",
      targetCustomers: pitchOutput?.marketOpportunity?.targetCustomer || "Customers TBD"
    };

    // Use the new AI service with retry mechanism
    console.log(`[GTM] Starting GTM strategy generation for project ${projectId}`);
    
    const prompt = GTM_PROMPT.replace("{full_business_plan}", JSON.stringify(businessContext));
    const userPrompt = `Create a 6-month go-to-market strategy for: ${businessContext.businessIdea}. Target: ${businessContext.targetCustomers}. Value: ${businessContext.valueProposition}.`;

    const aiResult = await AIService.generateWithRetry({
      prompt,
      userPrompt,
      retryConfig: {
        maxRetries: 3,
        timeoutMs: 240000, // 4 minutes
        backoffMs: 3000    // 3 second initial backoff
      }
    });

    let parsedResponse;
    
    if (aiResult.successful) {
      console.log(`[GTM] AI generation successful after ${aiResult.retryCount} retries`);
      
      const jsonResult = AIService.parseJSONResponse(aiResult.content);
      
      if (jsonResult.success) {
        parsedResponse = jsonResult.parsed;
      } else {
        console.warn(`[GTM] JSON parsing failed: ${jsonResult.error}`);
        parsedResponse = AIService.createFallbackResponse('gtm', prompt);
        parsedResponse._originalResponse = aiResult.content.substring(0, 500);
      }
    } else {
      console.error(`[GTM] AI generation failed after ${aiResult.retryCount} retries`);
      parsedResponse = AIService.createFallbackResponse('gtm', prompt);
      parsedResponse._retryCount = aiResult.retryCount;
    }

    // Update project with the GTM output and deduct credits
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          gtmOutput: parsedResponse,
          updatedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - GTM_COST,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      result: parsedResponse,
      creditsUsed: GTM_COST,
      creditsRemaining: user.credits - GTM_COST,
    });
  } catch (error) {
    console.error("Error in GTM:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}