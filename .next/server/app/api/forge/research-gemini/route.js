"use strict";(()=>{var a={};a.id=99,a.ids=[99],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{a.exports=require("querystring")},12412:a=>{a.exports=require("assert")},21820:a=>{a.exports=require("os")},27910:a=>{a.exports=require("stream")},28354:a=>{a.exports=require("util")},29021:a=>{a.exports=require("fs")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{a.exports=require("path")},34631:a=>{a.exports=require("tls")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{a.exports=require("crypto")},55591:a=>{a.exports=require("https")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},67530:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>I,patchFetch:()=>H,routeModule:()=>D,serverHooks:()=>G,workAsyncStorage:()=>E,workUnitAsyncStorage:()=>F});var d={};c.r(d),c.d(d,{POST:()=>C,maxDuration:()=>A});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(19854),w=c(12909),x=c(31183),y=c(81849),z=c(48276);let A=300,B=`You are the 'Deep Dive Research' module of VentureForge AI, an elite business intelligence system.

**CRITICAL REQUIREMENT:** This research will be used by real entrepreneurs and investors making actual business decisions. Provide exhaustive, professional-grade analysis with specific data, citations, and actionable insights. Generic or superficial content is unacceptable.

**TASK:** Conduct comprehensive market research and competitive analysis on the business idea: {selected_idea}

**RESEARCH METHODOLOGY:**
1. Market Sizing: Use bottom-up and top-down approaches with specific data sources
2. Competitive Analysis: Identify actual companies, their financials, and market positions
3. Customer Research: Detail specific personas, segments, and quantified pain points
4. Technology Assessment: Evaluate implementation complexity and required capabilities
5. Financial Benchmarks: Provide industry-specific metrics and benchmarks

**OUTPUT FORMAT - COMPREHENSIVE JSON:**
{
  "marketLandscape": {
    "totalAddressableMarket": "Specific $ amount with methodology (e.g., $12.3B based on X million potential customers \xd7 $Y average spend)",
    "serviceableAddressableMarket": "Realistic SAM with geographic/demographic constraints",
    "marketGrowthRate": "X.X% CAGR with time period and driving factors",
    "keyTrends": "Detailed analysis of 3-4 major trends reshaping the industry",
    "marketMaturity": "Stage of market development with implications",
    "seasonality": "Any seasonal patterns affecting demand"
  },
  "targetCustomerAnalysis": {
    "primarySegment": "Detailed description of ideal customer profile",
    "customerPainPoints": ["Specific, quantified pain points with evidence"],
    "buyingBehavior": "How customers currently solve this problem and decision-making process",
    "customerAcquisitionCost": "Industry benchmarks for CAC in this sector",
    "lifetimeValue": "Expected LTV based on similar business models",
    "segmentSize": "Number of potential customers in primary segment"
  },
  "competitiveLandscape": {
    "mainCompetitors": ["List of 5-7 specific companies competing directly"],
    "competitiveGap": "Detailed analysis of unmet needs and positioning opportunities",
    "competitiveAdvantages": ["Specific advantages this business could develop"],
    "threatLevel": "Assessment of competitive intensity and barriers to entry",
    "marketPosition": "Recommended positioning strategy based on competitive gaps"
  },
  "technologyAnalysis": {
    "requiredTechnologies": ["Specific technologies needed for implementation"],
    "implementationComplexity": "Detailed assessment of technical challenges",
    "developmentTimeline": "Realistic timeline for MVP and full product development",
    "technologyTrends": "Emerging technologies that could impact the business",
    "technicalRisks": "Key technology risks and mitigation strategies"
  },
  "regulatoryConsiderations": {
    "relevantRegulations": ["Specific regulations, licenses, or compliance requirements"],
    "complianceRequirements": "Detailed compliance obligations and costs",
    "regulatoryTrends": "Upcoming regulatory changes that could impact the business"
  },
  "financialBenchmarks": {
    "industryMetrics": "Key financial metrics for similar businesses (gross margins, churn rates, etc.)",
    "revenueModels": "Analysis of successful revenue models in this space",
    "pricingStrategies": "Pricing benchmarks and strategies used by competitors",
    "unitEconomics": "Industry benchmarks for unit economics"
  }
}

**QUALITY STANDARDS:**
- Include specific company names, market sizes, and financial figures where relevant
- Provide reasoning and methodology for all quantitative estimates
- Reference industry reports, market studies, or comparable business metrics
- Focus on actionable insights that inform business strategy
- Maintain objectivity while highlighting opportunities

Generate comprehensive, professional-grade market research now. Return ONLY the JSON object.`;async function C(a){try{let b,c=await (0,v.getServerSession)(w.N);if(!c?.user?.email)return u.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:d,selectedIdea:e}=await a.json();if(!d||!e)return u.NextResponse.json({error:"Project ID and selected idea are required"},{status:400});let f=await x.z.user.findUnique({where:{email:c.user.email}});if(!f)return u.NextResponse.json({error:"User not found"},{status:404});if(f.credits<5)return u.NextResponse.json({error:"Insufficient credits",required:5,current:f.credits},{status:402});if(!await x.z.project.findFirst({where:{id:d,userId:f.id}}))return u.NextResponse.json({error:"Project not found"},{status:404});let g=B.replace("{selected_idea}",JSON.stringify(e)),h=`Please conduct comprehensive market research for this business idea: ${JSON.stringify(e)}

Focus on providing realistic, data-backed insights about:
1. Market size and growth potential
2. Target customer segments and their pain points
3. Competitive landscape and positioning opportunities
4. Technology requirements and implementation complexity
5. Key market trends and risk factors

Return the response as a properly formatted JSON object.`;console.log(`[RESEARCH] Starting research generation for project ${d}`);let i=await y.U.generateWithRetry({prompt:g,userPrompt:h,retryConfig:{maxRetries:3,timeoutMs:28e4,backoffMs:3e3}});if(i.successful){console.log(`[RESEARCH] AI generation successful after ${i.retryCount} retries`);let a=y.U.parseJSONResponse(i.content);a.success?b=a.parsed:(console.warn(`[RESEARCH] JSON parsing failed: ${a.error}`),(b=y.U.createFallbackResponse("research",g))._originalResponse=i.content.substring(0,500))}else console.error(`[RESEARCH] AI generation failed after ${i.retryCount} retries`),(b=y.U.createFallbackResponse("research",g))._retryCount=i.retryCount;let j=await z.P.encryptUserData(f.id,b);return await x.z.$transaction([x.z.project.update({where:{id:d},data:{researchOutput:j,updatedAt:new Date}}),x.z.user.update({where:{id:f.id},data:{credits:f.credits-5}})]),u.NextResponse.json({success:!0,result:b,creditsUsed:5,creditsRemaining:f.credits-5})}catch(a){if(console.error("Error in Gemini research:",a),a instanceof Error&&"Request timeout"===a.message)return u.NextResponse.json({error:"Research request timed out. Please try again with a simpler query."},{status:408});return u.NextResponse.json({error:"Internal server error"},{status:500})}}let D=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/forge/research-gemini/route",pathname:"/api/forge/research-gemini",filename:"route",bundlePath:"app/api/forge/research-gemini/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/forge/research-gemini/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:E,workUnitAsyncStorage:F,serverHooks:G}=D;function H(){return(0,g.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:F})}async function I(a,b,c){var d;let e="/api/forge/research-gemini/route";"/index"===e&&(e="/");let g=await D.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[C]);if(F&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||D.isDev||x||(G="/index"===(G=C)?"/":G);let H=!0===D.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>D.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>D.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await D.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await D.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await D.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},73496:a=>{a.exports=require("http2")},74075:a=>{a.exports=require("zlib")},79428:a=>{a.exports=require("buffer")},79551:a=>{a.exports=require("url")},81630:a=>{a.exports=require("http")},83997:a=>{a.exports=require("tty")},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")},91645:a=>{a.exports=require("net")},94735:a=>{a.exports=require("events")},96330:a=>{a.exports=require("@prisma/client")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[602,446,190,248,449,756],()=>b(b.s=67530));module.exports=c})();