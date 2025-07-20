"use strict";(()=>{var a={};a.id=9920,a.ids=[9920],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{a.exports=require("querystring")},12412:a=>{a.exports=require("assert")},20364:(a,b,c)=>{c.d(b,{U:()=>e});var d=c(31183);class e{static async trackUsage({userId:a,action:b,creditsUsed:c,projectId:e,projectName:f,metadata:g={}}){try{let h=await d.z.user.findUnique({where:{id:a},select:{credits:!0,totalCreditsUsed:!0}});if(!h)throw Error("User not found for usage tracking");let i=h.credits-c,j=h.totalCreditsUsed+c;await d.z.$transaction([d.z.usageHistory.create({data:{userId:a,action:b,projectId:e,projectName:f,creditsUsed:c,creditsBalance:i,metadata:{...g,timestamp:new Date().toISOString(),userAgent:g.userAgent||"unknown"}}}),d.z.user.update({where:{id:a},data:{credits:i,totalCreditsUsed:j}})]),console.log(`Tracked usage: ${b} for user ${a} (${c} credits)`)}catch(a){console.error("Failed to track usage:",a)}}static async getUserUsageHistory(a,b=50,c=0){try{return await d.z.usageHistory.findMany({where:{userId:a},orderBy:{createdAt:"desc"},take:b,skip:c,select:{id:!0,action:!0,projectName:!0,creditsUsed:!0,creditsBalance:!0,createdAt:!0,metadata:!0}})}catch(a){return console.error("Failed to get usage history:",a),[]}}static async getUserUsageSummary(a){try{let[b,c]=await Promise.all([d.z.user.findUnique({where:{id:a},select:{credits:!0,totalCreditsUsed:!0,subscriptionPlan:!0,createdAt:!0}}),d.z.usageHistory.groupBy({by:["action"],where:{userId:a},_sum:{creditsUsed:!0},_count:{action:!0}})]);if(!b)throw Error("User not found");let e=c.reduce((a,b)=>(a[b.action]={count:b._count.action,totalCredits:b._sum.creditsUsed||0},a),{});return{currentCredits:b.credits,totalCreditsUsed:b.totalCreditsUsed,subscriptionPlan:b.subscriptionPlan,memberSince:b.createdAt,usageByAction:e}}catch(a){return console.error("Failed to get usage summary:",a),null}}static async checkCredits(a,b){try{let c=await d.z.user.findUnique({where:{id:a},select:{credits:!0}});return!!c&&c.credits>=b}catch(a){return console.error("Failed to check credits:",a),!1}}static async getCreditUsageTrends(a,b=30){try{let c=new Date;return c.setDate(c.getDate()-b),(await d.z.usageHistory.groupBy({by:["createdAt"],where:{userId:a,createdAt:{gte:c}},_sum:{creditsUsed:!0},orderBy:{createdAt:"asc"}})).reduce((a,b)=>{let c=b.createdAt.toISOString().split("T")[0];return a[c]=(a[c]||0)+(b._sum.creditsUsed||0),a},{})}catch(a){return console.error("Failed to get usage trends:",a),{}}}static async cleanupOldUsageHistory(a,b=90){try{let c=new Date;c.setDate(c.getDate()-b);let e=await d.z.usageHistory.deleteMany({where:{userId:a,createdAt:{lt:c}}});return console.log(`Cleaned up ${e.count} old usage records for user ${a}`),e.count}catch(a){return console.error("Failed to cleanup usage history:",a),0}}}},28354:a=>{a.exports=require("util")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{a.exports=require("crypto")},55591:a=>{a.exports=require("https")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{a.exports=require("zlib")},79428:a=>{a.exports=require("buffer")},79551:a=>{a.exports=require("url")},80821:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>J,patchFetch:()=>I,routeModule:()=>E,serverHooks:()=>H,workAsyncStorage:()=>F,workUnitAsyncStorage:()=>G});var d={};c.r(d),c.d(d,{POST:()=>D,maxDuration:()=>B});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(19854),w=c(12909),x=c(31183),y=c(81849),z=c(74339),A=c(20364);let B=300,C=`You are the 'Go-to-Market Strategist' module of VentureForge AI, an elite growth marketing and sales execution expert.

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

**CRITICAL CONSTRAINT - NO PLACEHOLDERS ALLOWED:**
- You MUST calculate and provide specific, numerical revenue targets for Month 1, 3, and 6 based on the provided financial projections
- Do NOT use "TBD", "X", "Y", "Z", or other placeholders in any section
- Replace ALL template variables (e.g., "$X,XXX", "X customers") with concrete numbers
- All metrics must be mathematically consistent with the financial projections provided
- If specific data is not available, make reasonable assumptions based on industry standards and clearly state the assumption

Generate a comprehensive, execution-ready GTM strategy now. Return ONLY the JSON object.`;async function D(a){try{let b,c=await (0,v.getServerSession)(w.N);if(!c?.user?.email)return u.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:d}=await a.json();if(!d)return u.NextResponse.json({error:"Project ID is required"},{status:400});let e=await x.z.user.findUnique({where:{email:c.user.email}});if(!e)return u.NextResponse.json({error:"User not found"},{status:404});if(!await A.U.checkCredits(e.id,10))return u.NextResponse.json({error:"Insufficient credits",required:10,current:e.credits},{status:402});let f=await x.z.project.findFirst({where:{id:d,userId:e.id}});if(!f)return u.NextResponse.json({error:"Project not found"},{status:404});if(f.expiresAt&&f.expiresAt<new Date)return u.NextResponse.json({error:"Project has expired"},{status:404});let g=await z.R.getProjectSession(d,e.id);if(g||(await z.R.createProjectSession(e.id,f.name,"PERSISTENT"===f.storageMode,f.expiresAt||void 0,f.id),g=await z.R.getProjectSession(d,e.id)),!g)return u.NextResponse.json({error:"Failed to initialize project session"},{status:500});if(!g.data.pitchOutput)return u.NextResponse.json({error:"Investor pitch must be completed before GTM strategy"},{status:400});let h=g.data.ideaOutput,i=g.data.researchOutput,j=g.data.blueprintOutput,k=g.data.financialOutput,l=g.data.pitchOutput,m={businessIdea:h?.selectedIdea?.title||"Business concept",targetMarket:i?.targetCustomerAnalysis?.primarySegment||"Target market analysis",valueProposition:j?.executiveSummary?.businessConcept||j?.valueProposition?.core||"Value proposition analysis",revenueModel:j?.coreBusinessModel?.primaryModel||"Revenue model analysis",fundingNeeds:k?.fundingAnalysis?.seedFunding||"$1,500,000",targetCustomers:l?.marketOpportunity?.targetCustomer||i?.targetCustomerAnalysis?.primarySegment||"Target customer analysis",financialProjections:{year1Revenue:k?.threeYearProjections?.year1?.totalRevenue||"$500,000",year2Revenue:k?.threeYearProjections?.year2?.totalRevenue||"$1,200,000",year3Revenue:k?.threeYearProjections?.year3?.totalRevenue||"$2,800,000",monthlyBurnRate:k?.fundingAnalysis?.monthlyBurnRate?.year1Average||"$75,000",customerCAC:k?.keyMetrics?.cac||"$500",customerLTV:k?.keyMetrics?.ltv||"$2,400",averageARPU:k?.revenueModel?.revenueStreams?.[0]?.pricingStrategy||"$200/month"},keyAssumptions:{customerGrowthRate:"25% monthly growth target",marketPenetration:"0.1% of TAM by Year 3",avgDealSize:k?.keyMetrics?.paybackPeriod||"12 months",conversionRate:"2.5% website to demo, 15% demo to close"}};console.log(`[GTM] Starting GTM strategy generation for project ${d}`);let n=C.replace("{full_business_plan}",JSON.stringify(m)),o=`Create a 6-month go-to-market strategy for: ${m.businessIdea}. 
    
    CRITICAL: Based on the financial projections (Year 1 Revenue: ${m.financialProjections.year1Revenue}, CAC: ${m.financialProjections.customerCAC}, LTV: ${m.financialProjections.customerLTV}), calculate specific monthly revenue targets that build toward the Year 1 goal.
    
    Target Customer: ${m.targetCustomers}
    Value Proposition: ${m.valueProposition}
    
    You must provide concrete numbers for all metrics - NO placeholders or TBD values allowed.`,p=await y.U.generateWithRetry({prompt:n,userPrompt:o,retryConfig:{maxRetries:3,timeoutMs:24e4,backoffMs:3e3}});if(p.successful){console.log(`[GTM] AI generation successful after ${p.retryCount} retries`);let a=y.U.parseJSONResponse(p.content);a.success?b=a.parsed:(console.warn(`[GTM] JSON parsing failed: ${a.error}`),(b=y.U.createFallbackResponse("gtm",n))._originalResponse=p.content.substring(0,500))}else console.error(`[GTM] AI generation failed after ${p.retryCount} retries`),(b=y.U.createFallbackResponse("gtm",n))._retryCount=p.retryCount;if(!await z.R.updateProjectData(d,e.id,"gtmOutput",b))return u.NextResponse.json({error:"Failed to update project data"},{status:500});return await A.U.trackUsage({userId:e.id,action:"GTM",creditsUsed:10,projectId:d,projectName:g.name,metadata:{aiModel:"gpt-4",retryCount:p.retryCount,successful:p.successful}}),u.NextResponse.json({success:!0,result:b,creditsUsed:10,creditsRemaining:e.credits-10})}catch(a){return console.error("Error in GTM:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let E=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/forge/gtm/route",pathname:"/api/forge/gtm",filename:"route",bundlePath:"app/api/forge/gtm/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/forge/gtm/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:F,workUnitAsyncStorage:G,serverHooks:H}=E;function I(){return(0,g.patchFetch)({workAsyncStorage:F,workUnitAsyncStorage:G})}async function J(a,b,c){var d;let e="/api/forge/gtm/route";"/index"===e&&(e="/");let g=await E.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,D=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[D]||y.routes[C]);if(F&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[D];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||E.isDev||x||(G="/index"===(G=C)?"/":G);let H=!0===E.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>E.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>E.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await E.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await E.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await E.onRequestError(a,b,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},81630:a=>{a.exports=require("http")},81849:(a,b,c)=>{c.d(b,{U:()=>h});var d=c(37449);if(!process.env.GEMINI_API_KEY)throw Error("GEMINI_API_KEY is not set in environment variables");let e=new d.ij(process.env.GEMINI_API_KEY),f=e.getGenerativeModel({model:"gemini-2.0-flash-exp",generationConfig:{maxOutputTokens:8192,temperature:.7}});e.getGenerativeModel({model:"gemini-1.5-pro",generationConfig:{maxOutputTokens:8192,temperature:.5}}),e.getGenerativeModel({model:"gemini-1.5-flash",generationConfig:{maxOutputTokens:8192,temperature:.7}});let g={maxRetries:3,timeoutMs:3e5,backoffMs:2e3};class h{static async delay(a){return new Promise(b=>setTimeout(b,a))}static async makeGeminiRequest(a,b,c){let d=f.generateContent([a,b]),e=new Promise((a,b)=>setTimeout(()=>b(Error("Request timeout")),c));return(await Promise.race([d,e])).response.text()}static async generateWithRetry(a){let b={...g,...a.retryConfig},c=null,d=0;for(let e=0;e<=b.maxRetries;e++)try{console.log(`[AI_SERVICE] Attempt ${e+1}/${b.maxRetries+1}`);let c=await this.makeGeminiRequest(a.prompt,a.userPrompt,b.timeoutMs);if(!c)throw Error("Empty response from AI service");return console.log(`[AI_SERVICE] Success on attempt ${e+1}`),{content:c,retryCount:e,successful:!0}}catch(a){if(c=a,d=e,console.warn(`[AI_SERVICE] Attempt ${e+1} failed:`,c.message),e<b.maxRetries){let a=b.backoffMs*Math.pow(2,e);console.log(`[AI_SERVICE] Retrying in ${a}ms...`),await this.delay(a)}}return console.error(`[AI_SERVICE] All ${b.maxRetries+1} attempts failed. Last error:`,c?.message),{content:"",retryCount:d,successful:!1}}static async generateInPhases(a,b){let c=[],d="",e=!0;for(let f=0;f<a.length;f++){let g=a[f];console.log(`[AI_SERVICE] Starting phase ${f+1}/${a.length}`);let h=g.prompt;(g.context||d)&&(h+=`

**CONTEXT FROM PREVIOUS PHASES:**
${JSON.stringify(g.context||d.substring(0,1e3))}`);let i=await this.generateWithRetry({prompt:h,userPrompt:g.userPrompt,retryConfig:b});c.push(i),i.successful?d+=i.content+"\n\n":(console.error(`[AI_SERVICE] Phase ${f+1} failed, continuing with partial results`),e=!1)}return{phases:c,combinedContent:d.trim(),successful:e}}static parseJSONResponse(a){try{let b=a.replace(/```json\n?|\n?```/g,"").trim();return{parsed:JSON.parse(b),success:!0}}catch(b){return console.error("[AI_SERVICE] JSON parsing error:",b),console.error("[AI_SERVICE] Raw response:",a.substring(0,500)),{parsed:null,success:!1,error:`JSON parsing failed: ${b.message}`}}}static createFallbackResponse(a,b){let c=new Date().toISOString();return({research:{marketLandscape:{totalAddressableMarket:"Analysis in progress - AI service temporarily unavailable",serviceableAddressableMarket:"To be determined when service recovers",marketGrowthRate:"Pending analysis",keyTrends:"Market research will be completed when AI service is restored"},targetCustomerAnalysis:{primarySegment:"Customer analysis pending",customerPainPoints:["Analysis interrupted - will complete when service is restored"],buyingBehavior:"Research in progress"},competitiveLandscape:{mainCompetitors:["Analysis will be completed when AI service recovers"],competitiveGap:"Detailed analysis pending service restoration"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - analysis will be completed when service is restored"},blueprint:{executiveSummary:{businessConcept:"Business analysis interrupted - will be completed when AI service is restored",marketOpportunity:"Analysis pending",uniqueAdvantage:"To be determined",revenueProjection:"Financial analysis will be completed when service recovers"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - blueprint will be completed when service is restored"},financials:{keyAssumptions:[{assumption:"Analysis Pending",value:"To be calculated when AI service is restored",justification:"Financial modeling interrupted - will complete when service is available"}],_fallback:!0,_timestamp:c,_reason:"AI service timeout - financial projections will be completed when service is restored"},pitch:{executiveSummary:"Pitch development interrupted - will be completed when AI service is restored",pitchDeckSlides:{problemSlide:{headline:"Analysis in Progress",problemStatement:"Pitch development will be completed when AI service is restored"}},_fallback:!0,_timestamp:c,_reason:"AI service timeout - investor pitch will be completed when service is restored"},gtm:{strategicOverview:{gtmThesis:"Go-to-market analysis interrupted - will be completed when AI service is restored",marketEntryStrategy:"Analysis pending",primaryObjective:"Strategy development will resume when service is available"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - GTM strategy will be completed when service is restored"}})[a]||{message:"Analysis in progress - will be completed when AI service is restored",_fallback:!0,_timestamp:c,_moduleType:a}}}},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")},94735:a=>{a.exports=require("events")},96330:a=>{a.exports=require("@prisma/client")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[2073,4446,2190,7449,1771],()=>b(b.s=80821));module.exports=c})();