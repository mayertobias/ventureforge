"use strict";(()=>{var a={};a.id=5042,a.ids=[5042],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},8432:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>I,patchFetch:()=>H,routeModule:()=>D,serverHooks:()=>G,workAsyncStorage:()=>E,workUnitAsyncStorage:()=>F});var d={};c.r(d),c.d(d,{POST:()=>C,maxDuration:()=>A});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(19854),w=c(12909),x=c(31183),y=c(81849),z=c(48276);let A=300,B=`You are the 'Financial Forecaster' module of VentureForge AI, an elite financial modeling expert.

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

Generate professional, investor-ready financial projections now. Return ONLY the JSON object.`;async function C(a){try{let b,c=await (0,v.getServerSession)(w.N);if(!c?.user?.email)return u.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:d}=await a.json();if(!d)return u.NextResponse.json({error:"Project ID is required"},{status:400});let e=await x.z.user.findUnique({where:{email:c.user.email}});if(!e)return u.NextResponse.json({error:"User not found"},{status:404});if(e.credits<12)return u.NextResponse.json({error:"Insufficient credits",required:12,current:e.credits},{status:402});let f=await x.z.project.findFirst({where:{id:d,userId:e.id}});if(!f)return u.NextResponse.json({error:"Project not found"},{status:404});if(!f.blueprintOutput)return u.NextResponse.json({error:"Business blueprint must be completed before financial projections"},{status:400});let g=f.ideaOutput?await z.P.decryptUserData(e.id,f.ideaOutput):null,h=f.researchOutput?await z.P.decryptUserData(e.id,f.researchOutput):null,i=await z.P.decryptUserData(e.id,f.blueprintOutput);console.log(`[FINANCIALS] Starting financial projections for project ${d}`);let j=B.replace("{business_plan}",JSON.stringify({idea:g,research:h,blueprint:i})),k=await y.U.generateWithRetry({prompt:j,userPrompt:"Please create comprehensive financial projections based on the business plan data.",retryConfig:{maxRetries:3,timeoutMs:24e4,backoffMs:3e3}});if(k.successful){console.log(`[FINANCIALS] AI generation successful after ${k.retryCount} retries`);let a=y.U.parseJSONResponse(k.content);a.success?b=a.parsed:(console.warn(`[FINANCIALS] JSON parsing failed: ${a.error}`),(b=y.U.createFallbackResponse("financials",j))._originalResponse=k.content.substring(0,500))}else console.error(`[FINANCIALS] AI generation failed after ${k.retryCount} retries`),(b=y.U.createFallbackResponse("financials",j))._retryCount=k.retryCount;let l=await z.P.encryptUserData(e.id,b);return await x.z.$transaction([x.z.project.update({where:{id:d},data:{financialOutput:l,updatedAt:new Date}}),x.z.user.update({where:{id:e.id},data:{credits:e.credits-12}})]),u.NextResponse.json({success:!0,result:b,creditsUsed:12,creditsRemaining:e.credits-12})}catch(a){return console.error("Error in financials:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let D=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/forge/financials/route",pathname:"/api/forge/financials",filename:"route",bundlePath:"app/api/forge/financials/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/forge/financials/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:E,workUnitAsyncStorage:F,serverHooks:G}=D;function H(){return(0,g.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:F})}async function I(a,b,c){var d;let e="/api/forge/financials/route";"/index"===e&&(e="/");let g=await D.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[C]);if(F&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||D.isDev||x||(G="/index"===(G=C)?"/":G);let H=!0===D.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>D.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>D.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await D.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await D.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await D.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{a.exports=require("querystring")},12412:a=>{a.exports=require("assert")},21820:a=>{a.exports=require("os")},27910:a=>{a.exports=require("stream")},28354:a=>{a.exports=require("util")},29021:a=>{a.exports=require("fs")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{a.exports=require("path")},34631:a=>{a.exports=require("tls")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{a.exports=require("crypto")},55591:a=>{a.exports=require("https")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73496:a=>{a.exports=require("http2")},74075:a=>{a.exports=require("zlib")},79428:a=>{a.exports=require("buffer")},79551:a=>{a.exports=require("url")},81630:a=>{a.exports=require("http")},83997:a=>{a.exports=require("tty")},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")},91645:a=>{a.exports=require("net")},94735:a=>{a.exports=require("events")},96330:a=>{a.exports=require("@prisma/client")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[2073,4446,2190,5016,2756],()=>b(b.s=8432));module.exports=c})();