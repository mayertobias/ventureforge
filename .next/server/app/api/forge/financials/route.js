"use strict";(()=>{var a={};a.id=5042,a.ids=[5042],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},8432:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>J,patchFetch:()=>I,routeModule:()=>E,serverHooks:()=>H,workAsyncStorage:()=>F,workUnitAsyncStorage:()=>G});var d={};c.r(d),c.d(d,{POST:()=>D,maxDuration:()=>B});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(19854),w=c(12909),x=c(31183),y=c(81849),z=c(74339),A=c(20364);let B=300,C=`You are the 'Financial Forecaster' module of VentureForge AI, an elite financial modeling expert.

**CRITICAL REQUIREMENT:** Generate investor-grade financial projections that real entrepreneurs and VCs will use for funding decisions. Every number must be defensible, realistic, and based on industry benchmarks. Superficial or placeholder projections are unacceptable.

**TASK:** Create comprehensive 3-year financial model with detailed assumptions and calculations for: {business_plan}

**FUNDING CONTEXT:** $1,500,000 seed funding target

**METHODOLOGY:**
1. Revenue Modeling: Build bottom-up revenue projections based on customer segments, pricing, and market penetration
2. Cost Structure: Detail all operational costs including personnel, technology, marketing, and overhead
3. Unit Economics: Calculate LTV, CAC, payback periods, and contribution margins
4. Cash Flow: Model monthly cash flows to determine funding requirements and runway
5. Scenario Analysis: Provide base case with sensitivity analysis

**OUTPUT FORMAT - COMPREHENSIVE FINANCIAL MODEL:**
{
  "keyAssumptions": [
    {
      "assumption": "Customer Acquisition Cost (CAC)",
      "value": "$XXX",
      "justification": "Based on [specific industry benchmark/study]: SaaS companies in [sector] average $X CAC. We project $Y due to [specific factors]",
      "sensitivity": "Range: $X-Y based on marketing channel efficiency"
    },
    {
      "assumption": "Monthly Churn Rate",
      "value": "X.X%",
      "justification": "Industry benchmark for [business type]: X%. We model Y% due to [specific retention strategies]",
      "impact": "1% churn increase reduces LTV by $X"
    },
    {
      "assumption": "Average Revenue Per User (ARPU)",
      "value": "$XXX/month",
      "justification": "Based on competitive pricing analysis and value proposition. [Competitor A]: $X, [Competitor B]: $Y",
      "growthTrajectory": "ARPU growth: X% annually through upselling and premium features"
    },
    {
      "assumption": "Market Penetration Rate",
      "value": "X.X% by Year 3",
      "justification": "Conservative estimate based on TAM of $XB and similar companies achieving X% penetration",
      "benchmarks": "Comparable companies: [Company A] achieved X% in Y years"
    },
    {
      "assumption": "Gross Margin",
      "value": "XX%",
      "justification": "Industry standard for [business model]: X-Y%. Our model assumes X% due to [cost structure]",
      "trajectory": "Improving from X% Year 1 to Y% Year 3 through economies of scale"
    }
  ],
  "revenueModel": {
    "revenueStreams": [
      {
        "stream": "Primary Subscription Revenue",
        "year1": "$XXX,XXX",
        "year2": "$X,XXX,XXX",
        "year3": "$X,XXX,XXX",
        "assumptions": "X customers \xd7 $Y ARPU \xd7 Z% growth rate",
        "customerGrowth": "Month 1: X customers → Month 36: Y customers"
      }
    ],
    "customerAcquisition": {
      "year1Customers": "XXX customers",
      "year2Customers": "X,XXX customers", 
      "year3Customers": "XX,XXX customers",
      "acquisitionChannels": "XX% organic, XX% paid, XX% partnerships",
      "seasonality": "Describe any seasonal patterns in customer acquisition"
    }
  },
  "threeYearProjections": {
    "year1": {
      "totalRevenue": "$XXX,XXX",
      "cogs": "$XX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$XXX,XXX",
      "ebitda": "-$XXX,XXX",
      "netProfitLoss": "-$XXX,XXX",
      "cashFlow": "-$XXX,XXX"
    },
    "year2": {
      "totalRevenue": "$X,XXX,XXX",
      "cogs": "$XXX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$X,XXX,XXX",
      "ebitda": "-$XXX,XXX",
      "netProfitLoss": "-$XXX,XXX",
      "cashFlow": "-$XXX,XXX"
    },
    "year3": {
      "totalRevenue": "$X,XXX,XXX",
      "cogs": "$XXX,XXX",
      "grossMargin": "XX%",
      "operatingExpenses": "$X,XXX,XXX",
      "ebitda": "$XXX,XXX",
      "netProfitLoss": "$XXX,XXX",
      "cashFlow": "$XXX,XXX"
    }
  },
  "costStructure": {
    "personnelCosts": {
      "year1": "$XXX,XXX",
      "year2": "$XXX,XXX", 
      "year3": "$XXX,XXX",
      "headcountPlan": "Year 1: X employees, Year 2: Y employees, Year 3: Z employees",
      "keyHires": "Month X: CTO ($X salary), Month Y: VP Sales ($Y salary)"
    },
    "technologyCosts": {
      "year1": "$XX,XXX",
      "year2": "$XX,XXX",
      "year3": "$XXX,XXX",
      "breakdown": "AWS: $X/month, SaaS tools: $Y/month, development: $Z"
    },
    "marketingCosts": {
      "year1": "$XXX,XXX", 
      "year2": "$XXX,XXX",
      "year3": "$XXX,XXX",
      "allocations": "Digital ads: XX%, content: XX%, events: XX%",
      "efficiency": "Blended CAC improving from $X to $Y over 3 years"
    }
  },
  "fundingAnalysis": {
    "seedFunding": "$1,500,000",
    "useOfFunds": {
      "personnel": "XX% ($XXX,XXX) - Engineering, sales, operations team",
      "marketing": "XX% ($XXX,XXX) - Customer acquisition and brand building", 
      "technology": "XX% ($XXX,XXX) - Product development and infrastructure",
      "operations": "XX% ($XXX,XXX) - Working capital and operational expenses",
      "contingency": "XX% ($XXX,XXX) - Risk buffer and unexpected opportunities"
    },
    "monthlyBurnRate": {
      "year1Average": "$XX,XXX/month",
      "year2Average": "$XXX,XXX/month",
      "year3Average": "$XXX,XXX/month",
      "peakBurn": "$XXX,XXX in Month XX"
    },
    "runwayAnalysis": {
      "currentFunding": "XX months to break-even",
      "calculation": "$1,500,000 \xf7 $XX,XXX avg monthly burn = XX months",
      "keyMilestones": "Month 12: $X MRR, Month 18: Break-even, Month 24: $Y MRR",
      "nextFundingRound": "Series A: $X-Y million in Month XX at $XM valuation"
    }
  },
  "keyMetrics": {
    "ltv": "$X,XXX",
    "cac": "$XXX", 
    "ltvCacRatio": "X.X:1",
    "paybackPeriod": "XX months",
    "arr": "$XXX,XXX (Year 1) → $X,XXX,XXX (Year 3)",
    "revenueGrowth": "XXX% Year 2, XXX% Year 3",
    "grossMarginTrend": "XX% → XX% → XX%",
    "burnMultiple": "X.X (revenue growth \xf7 net burn)"
  },
  "pathToProfitability": {
    "breakEvenMonth": "Month XX (when monthly revenue > monthly costs)",
    "breakEvenRevenue": "$XXX,XXX monthly recurring revenue", 
    "keyDrivers": "Customer growth rate of XX%/month + ARPU growth of X%/year",
    "profitabilityStrategy": "Detailed explanation of how unit economics and scale lead to profitability",
    "sensitivityAnalysis": "Break-even moves \xb1X months with \xb120% change in key assumptions"
  },
  "benchmarkAnalysis": {
    "industryComparisons": "Revenue multiple: X.Xx vs industry average of Y.Y",
    "competitorFinancials": "[Competitor A]: $XM revenue, XX% growth; [Competitor B]: $YM revenue, YY% growth",
    "valuationMetrics": "Projected Year 3 valuation: $X-YM based on X-Y revenue multiple"
  }
}

**QUALITY STANDARDS:**
- All numbers must be realistic and defensible with specific justifications
- Include month-by-month cash flow implications for the first 18 months
- Reference specific industry benchmarks and comparable companies
- Show clear path from current state to profitability
- Include sensitivity analysis for key variables
- Demonstrate understanding of SaaS/startup financial metrics

Generate professional, investor-ready financial projections now. Return ONLY the JSON object.`;async function D(a){try{let b,c=await (0,v.getServerSession)(w.N);if(!c?.user?.email)return u.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:d}=await a.json();if(!d)return u.NextResponse.json({error:"Project ID is required"},{status:400});let e=await x.z.user.findUnique({where:{email:c.user.email}});if(!e)return u.NextResponse.json({error:"User not found"},{status:404});if(!await A.U.checkCredits(e.id,12))return u.NextResponse.json({error:"Insufficient credits",required:12,current:e.credits},{status:402});let f=await x.z.project.findFirst({where:{id:d,userId:e.id}});if(!f)return u.NextResponse.json({error:"Project not found"},{status:404});if(f.expiresAt&&f.expiresAt<new Date)return u.NextResponse.json({error:"Project has expired"},{status:404});let g=await z.R.getProjectSession(d,e.id);if(g||(await z.R.createProjectSession(e.id,f.name,"PERSISTENT"===f.storageMode,f.expiresAt||void 0,f.id),g=await z.R.getProjectSession(d,e.id)),!g)return u.NextResponse.json({error:"Failed to initialize project session"},{status:500});if(!g.data.blueprintOutput)return u.NextResponse.json({error:"Business blueprint must be completed before financial projections"},{status:400});let h={idea:g.data.ideaOutput||null,research:g.data.researchOutput||null,blueprint:g.data.blueprintOutput};console.log(`[FINANCIALS] Starting financial projections for project ${d}`);let i=C.replace("{business_plan}",JSON.stringify(h)),j=await y.U.generateWithRetry({prompt:i,userPrompt:"Please create comprehensive financial projections based on the business plan data.",retryConfig:{maxRetries:3,timeoutMs:24e4,backoffMs:3e3}});if(j.successful){console.log(`[FINANCIALS] AI generation successful after ${j.retryCount} retries`);let a=y.U.parseJSONResponse(j.content);a.success?b=a.parsed:(console.warn(`[FINANCIALS] JSON parsing failed: ${a.error}`),(b=y.U.createFallbackResponse("financials",i))._originalResponse=j.content.substring(0,500))}else console.error(`[FINANCIALS] AI generation failed after ${j.retryCount} retries`),(b=y.U.createFallbackResponse("financials",i))._retryCount=j.retryCount;if(!await z.R.updateProjectData(d,e.id,"financialOutput",b))return u.NextResponse.json({error:"Failed to update project data"},{status:500});return await A.U.trackUsage({userId:e.id,action:"FINANCIALS",creditsUsed:12,projectId:d,projectName:g.name,metadata:{aiModel:"gpt-4",retryCount:j.retryCount,successful:j.successful}}),u.NextResponse.json({success:!0,result:b,creditsUsed:12,creditsRemaining:e.credits-12})}catch(a){return console.error("Error in financials:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let E=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/forge/financials/route",pathname:"/api/forge/financials",filename:"route",bundlePath:"app/api/forge/financials/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/forge/financials/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:F,workUnitAsyncStorage:G,serverHooks:H}=E;function I(){return(0,g.patchFetch)({workAsyncStorage:F,workUnitAsyncStorage:G})}async function J(a,b,c){var d;let e="/api/forge/financials/route";"/index"===e&&(e="/");let g=await E.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,D=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[D]||y.routes[C]);if(F&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[D];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||E.isDev||x||(G="/index"===(G=C)?"/":G);let H=!0===E.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>E.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>E.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await E.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await E.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await E.onRequestError(a,b,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{a.exports=require("querystring")},12412:a=>{a.exports=require("assert")},20364:(a,b,c)=>{c.d(b,{U:()=>e});var d=c(31183);class e{static async trackUsage({userId:a,action:b,creditsUsed:c,projectId:e,projectName:f,metadata:g={}}){try{let h=await d.z.user.findUnique({where:{id:a},select:{credits:!0,totalCreditsUsed:!0}});if(!h)throw Error("User not found for usage tracking");let i=h.credits-c,j=h.totalCreditsUsed+c;await d.z.$transaction([d.z.usageHistory.create({data:{userId:a,action:b,projectId:e,projectName:f,creditsUsed:c,creditsBalance:i,metadata:{...g,timestamp:new Date().toISOString(),userAgent:g.userAgent||"unknown"}}}),d.z.user.update({where:{id:a},data:{credits:i,totalCreditsUsed:j}})]),console.log(`Tracked usage: ${b} for user ${a} (${c} credits)`)}catch(a){console.error("Failed to track usage:",a)}}static async getUserUsageHistory(a,b=50,c=0){try{return await d.z.usageHistory.findMany({where:{userId:a},orderBy:{createdAt:"desc"},take:b,skip:c,select:{id:!0,action:!0,projectName:!0,creditsUsed:!0,creditsBalance:!0,createdAt:!0,metadata:!0}})}catch(a){return console.error("Failed to get usage history:",a),[]}}static async getUserUsageSummary(a){try{let[b,c]=await Promise.all([d.z.user.findUnique({where:{id:a},select:{credits:!0,totalCreditsUsed:!0,subscriptionPlan:!0,createdAt:!0}}),d.z.usageHistory.groupBy({by:["action"],where:{userId:a},_sum:{creditsUsed:!0},_count:{action:!0}})]);if(!b)throw Error("User not found");let e=c.reduce((a,b)=>(a[b.action]={count:b._count.action,totalCredits:b._sum.creditsUsed||0},a),{});return{currentCredits:b.credits,totalCreditsUsed:b.totalCreditsUsed,subscriptionPlan:b.subscriptionPlan,memberSince:b.createdAt,usageByAction:e}}catch(a){return console.error("Failed to get usage summary:",a),null}}static async checkCredits(a,b){try{let c=await d.z.user.findUnique({where:{id:a},select:{credits:!0}});return!!c&&c.credits>=b}catch(a){return console.error("Failed to check credits:",a),!1}}static async getCreditUsageTrends(a,b=30){try{let c=new Date;return c.setDate(c.getDate()-b),(await d.z.usageHistory.groupBy({by:["createdAt"],where:{userId:a,createdAt:{gte:c}},_sum:{creditsUsed:!0},orderBy:{createdAt:"asc"}})).reduce((a,b)=>{let c=b.createdAt.toISOString().split("T")[0];return a[c]=(a[c]||0)+(b._sum.creditsUsed||0),a},{})}catch(a){return console.error("Failed to get usage trends:",a),{}}}static async cleanupOldUsageHistory(a,b=90){try{let c=new Date;c.setDate(c.getDate()-b);let e=await d.z.usageHistory.deleteMany({where:{userId:a,createdAt:{lt:c}}});return console.log(`Cleaned up ${e.count} old usage records for user ${a}`),e.count}catch(a){return console.error("Failed to cleanup usage history:",a),0}}}},28354:a=>{a.exports=require("util")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{a.exports=require("crypto")},55591:a=>{a.exports=require("https")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{a.exports=require("zlib")},79428:a=>{a.exports=require("buffer")},79551:a=>{a.exports=require("url")},81630:a=>{a.exports=require("http")},81849:(a,b,c)=>{c.d(b,{U:()=>h});var d=c(37449);if(!process.env.GEMINI_API_KEY)throw Error("GEMINI_API_KEY is not set in environment variables");let e=new d.ij(process.env.GEMINI_API_KEY),f=e.getGenerativeModel({model:"gemini-2.0-flash-exp",generationConfig:{maxOutputTokens:8192,temperature:.7}});e.getGenerativeModel({model:"gemini-1.5-pro",generationConfig:{maxOutputTokens:8192,temperature:.5}}),e.getGenerativeModel({model:"gemini-1.5-flash",generationConfig:{maxOutputTokens:8192,temperature:.7}});let g={maxRetries:3,timeoutMs:3e5,backoffMs:2e3};class h{static async delay(a){return new Promise(b=>setTimeout(b,a))}static async makeGeminiRequest(a,b,c){let d=f.generateContent([a,b]),e=new Promise((a,b)=>setTimeout(()=>b(Error("Request timeout")),c));return(await Promise.race([d,e])).response.text()}static async generateWithRetry(a){let b={...g,...a.retryConfig},c=null,d=0;for(let e=0;e<=b.maxRetries;e++)try{console.log(`[AI_SERVICE] Attempt ${e+1}/${b.maxRetries+1}`);let c=await this.makeGeminiRequest(a.prompt,a.userPrompt,b.timeoutMs);if(!c)throw Error("Empty response from AI service");return console.log(`[AI_SERVICE] Success on attempt ${e+1}`),{content:c,retryCount:e,successful:!0}}catch(a){if(c=a,d=e,console.warn(`[AI_SERVICE] Attempt ${e+1} failed:`,c.message),e<b.maxRetries){let a=b.backoffMs*Math.pow(2,e);console.log(`[AI_SERVICE] Retrying in ${a}ms...`),await this.delay(a)}}return console.error(`[AI_SERVICE] All ${b.maxRetries+1} attempts failed. Last error:`,c?.message),{content:"",retryCount:d,successful:!1}}static async generateInPhases(a,b){let c=[],d="",e=!0;for(let f=0;f<a.length;f++){let g=a[f];console.log(`[AI_SERVICE] Starting phase ${f+1}/${a.length}`);let h=g.prompt;(g.context||d)&&(h+=`

**CONTEXT FROM PREVIOUS PHASES:**
${JSON.stringify(g.context||d.substring(0,1e3))}`);let i=await this.generateWithRetry({prompt:h,userPrompt:g.userPrompt,retryConfig:b});c.push(i),i.successful?d+=i.content+"\n\n":(console.error(`[AI_SERVICE] Phase ${f+1} failed, continuing with partial results`),e=!1)}return{phases:c,combinedContent:d.trim(),successful:e}}static parseJSONResponse(a){try{let b=a.replace(/```json\n?|\n?```/g,"").trim();return{parsed:JSON.parse(b),success:!0}}catch(b){return console.error("[AI_SERVICE] JSON parsing error:",b),console.error("[AI_SERVICE] Raw response:",a.substring(0,500)),{parsed:null,success:!1,error:`JSON parsing failed: ${b.message}`}}}static createFallbackResponse(a,b){let c=new Date().toISOString();return({research:{marketLandscape:{totalAddressableMarket:"Analysis in progress - AI service temporarily unavailable",serviceableAddressableMarket:"To be determined when service recovers",marketGrowthRate:"Pending analysis",keyTrends:"Market research will be completed when AI service is restored"},targetCustomerAnalysis:{primarySegment:"Customer analysis pending",customerPainPoints:["Analysis interrupted - will complete when service is restored"],buyingBehavior:"Research in progress"},competitiveLandscape:{mainCompetitors:["Analysis will be completed when AI service recovers"],competitiveGap:"Detailed analysis pending service restoration"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - analysis will be completed when service is restored"},blueprint:{executiveSummary:{businessConcept:"Business analysis interrupted - will be completed when AI service is restored",marketOpportunity:"Analysis pending",uniqueAdvantage:"To be determined",revenueProjection:"Financial analysis will be completed when service recovers"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - blueprint will be completed when service is restored"},financials:{keyAssumptions:[{assumption:"Analysis Pending",value:"To be calculated when AI service is restored",justification:"Financial modeling interrupted - will complete when service is available"}],_fallback:!0,_timestamp:c,_reason:"AI service timeout - financial projections will be completed when service is restored"},pitch:{executiveSummary:"Pitch development interrupted - will be completed when AI service is restored",pitchDeckSlides:{problemSlide:{headline:"Analysis in Progress",problemStatement:"Pitch development will be completed when AI service is restored"}},_fallback:!0,_timestamp:c,_reason:"AI service timeout - investor pitch will be completed when service is restored"},gtm:{strategicOverview:{gtmThesis:"Go-to-market analysis interrupted - will be completed when AI service is restored",marketEntryStrategy:"Analysis pending",primaryObjective:"Strategy development will resume when service is available"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - GTM strategy will be completed when service is restored"}})[a]||{message:"Analysis in progress - will be completed when AI service is restored",_fallback:!0,_timestamp:c,_moduleType:a}}}},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")},94735:a=>{a.exports=require("events")},96330:a=>{a.exports=require("@prisma/client")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[2073,4446,2190,7449,1771],()=>b(b.s=8432));module.exports=c})();