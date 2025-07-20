"use strict";(()=>{var a={};a.id=4588,a.ids=[4588],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{a.exports=require("querystring")},12412:a=>{a.exports=require("assert")},20364:(a,b,c)=>{c.d(b,{U:()=>e});var d=c(31183);class e{static async trackUsage({userId:a,action:b,creditsUsed:c,projectId:e,projectName:f,metadata:g={}}){try{let h=await d.z.user.findUnique({where:{id:a},select:{credits:!0,totalCreditsUsed:!0}});if(!h)throw Error("User not found for usage tracking");let i=h.credits-c,j=h.totalCreditsUsed+c;await d.z.$transaction([d.z.usageHistory.create({data:{userId:a,action:b,projectId:e,projectName:f,creditsUsed:c,creditsBalance:i,metadata:{...g,timestamp:new Date().toISOString(),userAgent:g.userAgent||"unknown"}}}),d.z.user.update({where:{id:a},data:{credits:i,totalCreditsUsed:j}})]),console.log(`Tracked usage: ${b} for user ${a} (${c} credits)`)}catch(a){console.error("Failed to track usage:",a)}}static async getUserUsageHistory(a,b=50,c=0){try{return await d.z.usageHistory.findMany({where:{userId:a},orderBy:{createdAt:"desc"},take:b,skip:c,select:{id:!0,action:!0,projectName:!0,creditsUsed:!0,creditsBalance:!0,createdAt:!0,metadata:!0}})}catch(a){return console.error("Failed to get usage history:",a),[]}}static async getUserUsageSummary(a){try{let[b,c]=await Promise.all([d.z.user.findUnique({where:{id:a},select:{credits:!0,totalCreditsUsed:!0,subscriptionPlan:!0,createdAt:!0}}),d.z.usageHistory.groupBy({by:["action"],where:{userId:a},_sum:{creditsUsed:!0},_count:{action:!0}})]);if(!b)throw Error("User not found");let e=c.reduce((a,b)=>(a[b.action]={count:b._count.action,totalCredits:b._sum.creditsUsed||0},a),{});return{currentCredits:b.credits,totalCreditsUsed:b.totalCreditsUsed,subscriptionPlan:b.subscriptionPlan,memberSince:b.createdAt,usageByAction:e}}catch(a){return console.error("Failed to get usage summary:",a),null}}static async checkCredits(a,b){try{let c=await d.z.user.findUnique({where:{id:a},select:{credits:!0}});return!!c&&c.credits>=b}catch(a){return console.error("Failed to check credits:",a),!1}}static async getCreditUsageTrends(a,b=30){try{let c=new Date;return c.setDate(c.getDate()-b),(await d.z.usageHistory.groupBy({by:["createdAt"],where:{userId:a,createdAt:{gte:c}},_sum:{creditsUsed:!0},orderBy:{createdAt:"asc"}})).reduce((a,b)=>{let c=b.createdAt.toISOString().split("T")[0];return a[c]=(a[c]||0)+(b._sum.creditsUsed||0),a},{})}catch(a){return console.error("Failed to get usage trends:",a),{}}}static async cleanupOldUsageHistory(a,b=90){try{let c=new Date;c.setDate(c.getDate()-b);let e=await d.z.usageHistory.deleteMany({where:{userId:a,createdAt:{lt:c}}});return console.log(`Cleaned up ${e.count} old usage records for user ${a}`),e.count}catch(a){return console.error("Failed to cleanup usage history:",a),0}}}},28354:a=>{a.exports=require("util")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{a.exports=require("crypto")},55591:a=>{a.exports=require("https")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{a.exports=require("zlib")},75504:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>J,patchFetch:()=>I,routeModule:()=>E,serverHooks:()=>H,workAsyncStorage:()=>F,workUnitAsyncStorage:()=>G});var d={};c.r(d),c.d(d,{POST:()=>D,maxDuration:()=>B});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(19854),w=c(12909),x=c(31183),y=c(81849),z=c(74339),A=c(20364);let B=300,C=`You are the 'Pitch Perfect' module of VentureForge AI, an elite investment banker and pitch strategist.

**CRITICAL REQUIREMENT:** Create an investment-grade pitch that sophisticated VCs and angel investors will immediately understand and evaluate. This pitch will be used in actual funding rounds and board presentations. Generic content or vague assertions are unacceptable.

**TASK:** Transform comprehensive business plan into compelling, investment-ready materials: {full_business_plan}

**METHODOLOGY:**
1. Narrative Architecture: Build a compelling investment story with clear problem-solution fit
2. Market Validation: Demonstrate significant opportunity with defensible positioning
3. Financial Logic: Show clear path to substantial returns with realistic projections
4. Risk Assessment: Address key concerns proactively with mitigation strategies
5. Investor Psychology: Appeal to both rational analysis and emotional conviction

**OUTPUT FORMAT - INVESTMENT-GRADE PITCH:**
{
  "executiveSummary": "Compelling 3-4 sentence summary that captures: (1) The specific problem and market size, (2) Unique solution and defensible advantage, (3) Financial opportunity and growth trajectory, (4) Funding ask and key milestone. Must be immediately compelling to busy investors.",
  "pitchDeckSlides": {
    "problemSlide": {
      "headline": "Specific, Quantified Problem Statement",
      "problemStatement": "Detailed description of the pain point affecting specific customer segments",
      "marketPainPoints": ["$X cost annually", "Y hours wasted per transaction", "Z% failure rate in current solutions"],
      "urgency": "Why this problem is getting worse and needs solving now",
      "personalConnection": "Relatable scenario that makes the problem tangible"
    },
    "solutionSlide": {
      "headline": "Revolutionary Solution That Addresses Root Cause",
      "solutionDescription": "Clear explanation of how the product/service solves the problem uniquely",
      "keyDifferentiators": ["Specific advantage 1", "Specific advantage 2", "Specific advantage 3"],
      "productDemo": "Visual or conceptual description of the user experience",
      "proofOfConcept": "Evidence that the solution works (prototype, pilot, early results)"
    },
    "marketOpportunitySlide": {
      "headline": "Massive Market Opportunity with Clear Entry Point",
      "marketSizing": {
        "tam": "$X.XB Total Addressable Market with methodology",
        "sam": "$X.XM Serviceable Addressable Market with constraints",
        "som": "$X.XM Serviceable Obtainable Market (3-5 year target)"
      },
      "marketTrends": ["Trend 1 driving X% growth", "Trend 2 creating new demand", "Trend 3 disrupting incumbents"],
      "timingRationale": "Why now is the perfect time for this solution"
    },
    "businessModelSlide": {
      "headline": "Proven Revenue Model with Strong Unit Economics",
      "revenueModel": "Primary business model with specific pricing strategy",
      "unitEconomics": {
        "customerAcquisitionCost": "$XXX CAC with 12-month payback",
        "lifetimeValue": "$X,XXX LTV resulting in X:1 LTV/CAC ratio",
        "grossMargin": "XX% gross margin improving to XX% at scale"
      },
      "revenueStreams": "Primary and secondary revenue sources with relative contribution",
      "scalabilityFactors": "How revenue scales with customer growth and market expansion"
    },
    "tractionSlide": {
      "headline": "Strong Early Traction Validates Product-Market Fit",
      "keyMetrics": {
        "customers": "XXX paying customers with XX% month-over-month growth",
        "revenue": "$XXX MRR with $X,XXX average deal size",
        "retention": "XX% retention rate and XX% net revenue retention"
      },
      "socialProof": ["Customer testimonial highlighting specific value", "Industry recognition or awards"],
      "milestoneProgression": "Key achievements in chronological order showing momentum",
      "marketValidation": "Proof points that confirm market demand and willingness to pay"
    },
    "competitionSlide": {
      "headline": "Defensible Competitive Position with Clear Moats",
      "competitiveLandscape": "Direct and indirect competitors with their limitations",
      "competitiveAdvantages": [
        {
          "advantage": "Technology/Data/Network advantage",
          "description": "Specific description of the moat",
          "defensibility": "Why competitors cannot easily replicate this"
        }
      ],
      "marketPositioning": "How the company positions against alternatives",
      "winningStrategy": "Specific plan to capture market share from incumbents"
    },
    "financialProjectionsSlide": {
      "headline": "Path to $XXM Revenue with Clear Profitability Timeline",
      "revenueGrowth": {
        "year1": "$XXX,XXX revenue",
        "year2": "$X.XM revenue (XXX% growth)",
        "year3": "$X.XM revenue (XXX% growth)",
        "year5": "$XXM revenue target"
      },
      "profitabilityMetrics": {
        "grossMargin": "XX% gross margin by Year 3",
        "ebitdaMargin": "XX% EBITDA margin by Year 5",
        "breakEven": "Break-even in Month XX"
      },
      "keyDrivers": "Primary metrics driving financial performance",
      "sensitivityAnalysis": "Upside and downside scenarios with probability estimates"
    },
    "fundingAskSlide": {
      "headline": "Strategic $1.5M Investment to Achieve Market Leadership",
      "fundingAmount": "$1,500,000 Series Seed",
      "useOfFunds": {
        "productDevelopment": "XX% ($XXX,XXX) - Specific development milestones",
        "salesMarketing": "XX% ($XXX,XXX) - Customer acquisition scaling",
        "teamExpansion": "XX% ($XXX,XXX) - Key hires with titles and timing",
        "workingCapital": "XX% ($XXX,XXX) - Operations and contingency"
      },
      "keyMilestones": "Critical achievements this funding will enable",
      "nextFundingRound": "Series A target: $X-YM in Month XX at $XM-YM valuation",
      "investorReturns": "Projected X-Y multiple return based on exit scenarios"
    },
    "teamSlide": {
      "headline": "Proven Team with Domain Expertise and Execution Track Record",
      "founderBios": "Brief but compelling backgrounds highlighting relevant experience",
      "teamStrengths": "Complementary skills covering technology, business, and market expertise",
      "advisorBoard": "Industry advisors and their specific contributions",
      "hiringPlan": "Key roles to be filled with funding and their impact on growth",
      "culturalAdvantage": "Unique team dynamics or hiring advantages"
    },
    "exitStrategySlide": {
      "headline": "Clear Path to Liquidity with Multiple Exit Options",
      "exitScenarios": [
        {
          "type": "Strategic Acquisition",
          "potentialAcquirers": ["Company A (rationale)", "Company B (rationale)"],
          "valuationRange": "$X-YM based on revenue multiples",
          "strategicRationale": "Why acquirers would pay premium"
        },
        {
          "type": "IPO Path",
          "timeline": "Year 5-7 at $XXM+ revenue",
          "comparablePublicCos": "Trading at X-Y revenue multiples",
          "marketReadiness": "Path to IPO-ready scale and metrics"
        }
      ],
      "investorReturns": "Target X-Y multiple return over 5-7 year period",
      "liquidityEvents": "Potential secondary opportunities or partial exits"
    }
  },
  "investorQA": [
    {
      "question": "What is your sustainable competitive advantage?",
      "answer": "Detailed explanation of defensible moats with specific examples and timeline for building them"
    },
    {
      "question": "How do you plan to acquire customers cost-effectively?",
      "answer": "Multi-channel acquisition strategy with specific CAC targets and scaling plan"
    },
    {
      "question": "What are the biggest risks to your business model?",
      "answer": "Honest assessment of key risks with specific mitigation strategies and contingency plans"
    },
    {
      "question": "How does this scale to a billion-dollar company?",
      "answer": "Long-term vision with market expansion opportunities and revenue scale potential"
    },
    {
      "question": "Why is this the right team to execute on this opportunity?",
      "answer": "Team credibility based on relevant experience, domain expertise, and execution capability"
    },
    {
      "question": "What happens if a big tech company enters your market?",
      "answer": "Competitive response strategy and advantages that protect against big tech disruption"
    }
  ],
  "appendixData": {
    "marketResearch": "Key market size and trend data with sources",
    "customerReferences": "Customer testimonials and case studies",
    "technicalDetails": "Product architecture and technical differentiation",
    "financialModel": "Detailed unit economics and assumption sensitivity",
    "competitorAnalysis": "In-depth competitive positioning and response plan"
  }
}

**QUALITY STANDARDS:**
- Every claim must be backed by specific data or logical reasoning
- Financial projections must align with provided business plan
- Narrative must flow logically from problem to solution to opportunity
- Address investor concerns proactively without appearing defensive
- Balance ambitious vision with realistic near-term execution
- Include specific metrics, timelines, and success criteria throughout

Generate a compelling, investment-grade pitch presentation now. Return ONLY the JSON object.`;async function D(a){try{let b,c=await (0,v.getServerSession)(w.N);if(!c?.user?.email)return u.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:d}=await a.json();if(!d)return u.NextResponse.json({error:"Project ID is required"},{status:400});let e=await x.z.user.findUnique({where:{email:c.user.email}});if(!e)return u.NextResponse.json({error:"User not found"},{status:404});if(!await A.U.checkCredits(e.id,8))return u.NextResponse.json({error:"Insufficient credits",required:8,current:e.credits},{status:402});let f=await x.z.project.findFirst({where:{id:d,userId:e.id}});if(!f)return u.NextResponse.json({error:"Project not found"},{status:404});if(f.expiresAt&&f.expiresAt<new Date)return u.NextResponse.json({error:"Project has expired"},{status:404});let g=await z.R.getProjectSession(d,e.id);if(g||(await z.R.createProjectSession(e.id,f.name,"PERSISTENT"===f.storageMode,f.expiresAt||void 0,f.id),g=await z.R.getProjectSession(d,e.id)),!g)return u.NextResponse.json({error:"Failed to initialize project session"},{status:500});if(!g.data.financialOutput)return u.NextResponse.json({error:"Financial projections must be completed before creating pitch"},{status:400});let h={idea:g.data.ideaOutput||null,research:g.data.researchOutput||null,blueprint:g.data.blueprintOutput||null,financials:g.data.financialOutput};console.log(`[PITCH] Starting pitch generation for project ${d}`);let i=C.replace("{full_business_plan}",JSON.stringify(h)),j=await y.U.generateWithRetry({prompt:i,userPrompt:"Please create a compelling investor pitch based on the complete business plan.",retryConfig:{maxRetries:3,timeoutMs:24e4,backoffMs:3e3}});if(j.successful){console.log(`[PITCH] AI generation successful after ${j.retryCount} retries`);let a=y.U.parseJSONResponse(j.content);a.success?b=a.parsed:(console.warn(`[PITCH] JSON parsing failed: ${a.error}`),(b=y.U.createFallbackResponse("pitch",i))._originalResponse=j.content.substring(0,500))}else console.error(`[PITCH] AI generation failed after ${j.retryCount} retries`),(b=y.U.createFallbackResponse("pitch",i))._retryCount=j.retryCount;if(!await z.R.updateProjectData(d,e.id,"pitchOutput",b))return u.NextResponse.json({error:"Failed to update project data"},{status:500});return await A.U.trackUsage({userId:e.id,action:"PITCH",creditsUsed:8,projectId:d,projectName:g.name,metadata:{aiModel:"gpt-4",retryCount:j.retryCount,successful:j.successful}}),u.NextResponse.json({success:!0,result:b,creditsUsed:8,creditsRemaining:e.credits-8})}catch(a){return console.error("Error in pitch:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let E=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/forge/pitch/route",pathname:"/api/forge/pitch",filename:"route",bundlePath:"app/api/forge/pitch/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/forge/pitch/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:F,workUnitAsyncStorage:G,serverHooks:H}=E;function I(){return(0,g.patchFetch)({workAsyncStorage:F,workUnitAsyncStorage:G})}async function J(a,b,c){var d;let e="/api/forge/pitch/route";"/index"===e&&(e="/");let g=await E.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,D=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[D]||y.routes[C]);if(F&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[D];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||E.isDev||x||(G="/index"===(G=C)?"/":G);let H=!0===E.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>E.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>E.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await E.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await E.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await E.onRequestError(a,b,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},79428:a=>{a.exports=require("buffer")},79551:a=>{a.exports=require("url")},81630:a=>{a.exports=require("http")},81849:(a,b,c)=>{c.d(b,{U:()=>h});var d=c(37449);if(!process.env.GEMINI_API_KEY)throw Error("GEMINI_API_KEY is not set in environment variables");let e=new d.ij(process.env.GEMINI_API_KEY),f=e.getGenerativeModel({model:"gemini-2.0-flash-exp",generationConfig:{maxOutputTokens:8192,temperature:.7}});e.getGenerativeModel({model:"gemini-1.5-pro",generationConfig:{maxOutputTokens:8192,temperature:.5}}),e.getGenerativeModel({model:"gemini-1.5-flash",generationConfig:{maxOutputTokens:8192,temperature:.7}});let g={maxRetries:3,timeoutMs:3e5,backoffMs:2e3};class h{static async delay(a){return new Promise(b=>setTimeout(b,a))}static async makeGeminiRequest(a,b,c){let d=f.generateContent([a,b]),e=new Promise((a,b)=>setTimeout(()=>b(Error("Request timeout")),c));return(await Promise.race([d,e])).response.text()}static async generateWithRetry(a){let b={...g,...a.retryConfig},c=null,d=0;for(let e=0;e<=b.maxRetries;e++)try{console.log(`[AI_SERVICE] Attempt ${e+1}/${b.maxRetries+1}`);let c=await this.makeGeminiRequest(a.prompt,a.userPrompt,b.timeoutMs);if(!c)throw Error("Empty response from AI service");return console.log(`[AI_SERVICE] Success on attempt ${e+1}`),{content:c,retryCount:e,successful:!0}}catch(a){if(c=a,d=e,console.warn(`[AI_SERVICE] Attempt ${e+1} failed:`,c.message),e<b.maxRetries){let a=b.backoffMs*Math.pow(2,e);console.log(`[AI_SERVICE] Retrying in ${a}ms...`),await this.delay(a)}}return console.error(`[AI_SERVICE] All ${b.maxRetries+1} attempts failed. Last error:`,c?.message),{content:"",retryCount:d,successful:!1}}static async generateInPhases(a,b){let c=[],d="",e=!0;for(let f=0;f<a.length;f++){let g=a[f];console.log(`[AI_SERVICE] Starting phase ${f+1}/${a.length}`);let h=g.prompt;(g.context||d)&&(h+=`

**CONTEXT FROM PREVIOUS PHASES:**
${JSON.stringify(g.context||d.substring(0,1e3))}`);let i=await this.generateWithRetry({prompt:h,userPrompt:g.userPrompt,retryConfig:b});c.push(i),i.successful?d+=i.content+"\n\n":(console.error(`[AI_SERVICE] Phase ${f+1} failed, continuing with partial results`),e=!1)}return{phases:c,combinedContent:d.trim(),successful:e}}static parseJSONResponse(a){try{let b=a.replace(/```json\n?|\n?```/g,"").trim();return{parsed:JSON.parse(b),success:!0}}catch(b){return console.error("[AI_SERVICE] JSON parsing error:",b),console.error("[AI_SERVICE] Raw response:",a.substring(0,500)),{parsed:null,success:!1,error:`JSON parsing failed: ${b.message}`}}}static createFallbackResponse(a,b){let c=new Date().toISOString();return({research:{marketLandscape:{totalAddressableMarket:"Analysis in progress - AI service temporarily unavailable",serviceableAddressableMarket:"To be determined when service recovers",marketGrowthRate:"Pending analysis",keyTrends:"Market research will be completed when AI service is restored"},targetCustomerAnalysis:{primarySegment:"Customer analysis pending",customerPainPoints:["Analysis interrupted - will complete when service is restored"],buyingBehavior:"Research in progress"},competitiveLandscape:{mainCompetitors:["Analysis will be completed when AI service recovers"],competitiveGap:"Detailed analysis pending service restoration"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - analysis will be completed when service is restored"},blueprint:{executiveSummary:{businessConcept:"Business analysis interrupted - will be completed when AI service is restored",marketOpportunity:"Analysis pending",uniqueAdvantage:"To be determined",revenueProjection:"Financial analysis will be completed when service recovers"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - blueprint will be completed when service is restored"},financials:{keyAssumptions:[{assumption:"Analysis Pending",value:"To be calculated when AI service is restored",justification:"Financial modeling interrupted - will complete when service is available"}],_fallback:!0,_timestamp:c,_reason:"AI service timeout - financial projections will be completed when service is restored"},pitch:{executiveSummary:"Pitch development interrupted - will be completed when AI service is restored",pitchDeckSlides:{problemSlide:{headline:"Analysis in Progress",problemStatement:"Pitch development will be completed when AI service is restored"}},_fallback:!0,_timestamp:c,_reason:"AI service timeout - investor pitch will be completed when service is restored"},gtm:{strategicOverview:{gtmThesis:"Go-to-market analysis interrupted - will be completed when AI service is restored",marketEntryStrategy:"Analysis pending",primaryObjective:"Strategy development will resume when service is available"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - GTM strategy will be completed when service is restored"}})[a]||{message:"Analysis in progress - will be completed when AI service is restored",_fallback:!0,_timestamp:c,_moduleType:a}}}},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")},94735:a=>{a.exports=require("events")},96330:a=>{a.exports=require("@prisma/client")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[2073,4446,2190,7449,1771],()=>b(b.s=75504));module.exports=c})();