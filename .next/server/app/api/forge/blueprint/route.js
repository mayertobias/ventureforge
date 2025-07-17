(()=>{var a={};a.id=607,a.ids=[607],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{"use strict";a.exports=require("querystring")},12412:a=>{"use strict";a.exports=require("assert")},12909:(a,b,c)=>{"use strict";c.d(b,{N:()=>f});var d=c(36344),e=c(94747);let f={providers:[(0,d.A)({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET})],callbacks:{async signIn({user:a,account:b,profile:c}){if(b?.provider==="google")try{await e.z.user.findUnique({where:{email:a.email}})||await e.z.user.create({data:{email:a.email,name:a.name,image:a.image,credits:100}})}catch(a){return console.error("Error creating user:",a),!1}return!0},async session({session:a,token:b}){if(a?.user?.email){let b=await e.z.user.findUnique({where:{email:a.user.email}});b&&a.user&&(a.user.id=b.id)}return a},jwt:async({user:a,token:b})=>b},session:{strategy:"jwt"},secret:process.env.NEXTAUTH_SECRET}},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33509:(a,b,c)=>{"use strict";c.d(b,{N:()=>d});let d=new(c(40694)).Ay({apiKey:process.env.OPENAI_API_KEY})},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{"use strict";a.exports=require("crypto")},55591:a=>{"use strict";a.exports=require("https")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{"use strict";a.exports=require("zlib")},78335:()=>{},79428:a=>{"use strict";a.exports=require("buffer")},79551:a=>{"use strict";a.exports=require("url")},80395:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>G,patchFetch:()=>F,routeModule:()=>B,serverHooks:()=>E,workAsyncStorage:()=>C,workUnitAsyncStorage:()=>D});var d={};c.r(d),c.d(d,{POST:()=>A});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(19854),w=c(12909),x=c(94747),y=c(33509);let z=`You are the 'Blueprint Architect' module of VentureForge AI.

**Task:** Formulate a comprehensive business model and strategic plan based on the provided research.

**INPUT:**
- research_report: {research_report}

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
{
  "coreBusinessModel": {
    "model": "Platform-as-a-Service (PaaS) / Data-as-a-Service (DaaS) / SaaS / Marketplace / etc.",
    "rationale": "Explanation why this model is optimal for the business"
  },
  "revenueStreams": [
    {
      "stream": "Revenue Stream Name",
      "type": "Subscription / One-Time / Usage-Based / Commission",
      "targetSegment": "Target customer segment",
      "illustrativePrice": "$XX/month or $XXX one-time",
      "justification": "Why this pricing makes sense"
    }
  ],
  "valuePropositions": [
    {
      "segment": "Customer Segment",
      "value": "Specific value proposition for this segment",
      "keyBenefits": ["benefit1", "benefit2", "benefit3"]
    }
  ],
  "operationalPlan": {
    "coreOperations": [
      {
        "operation": "Operation Name",
        "description": "What this operation involves",
        "resources": "Required resources",
        "scalingStrategy": "How to scale this operation"
      }
    ],
    "technologyStack": {
      "frontend": "Technology choices for frontend",
      "backend": "Backend architecture recommendations",
      "database": "Database technology and structure",
      "ai_ml": "AI/ML components and models"
    },
    "qualityControl": {
      "kpis": ["KPI 1", "KPI 2", "KPI 3"],
      "qualityMetrics": "How to measure and maintain quality",
      "scalingPlan": "Strategy for scaling operations"
    }
  },
  "goToMarketStrategy": {
    "primaryChannels": ["channel1", "channel2", "channel3"],
    "customerAcquisition": "Strategy for acquiring first customers",
    "partnerships": "Potential strategic partnerships",
    "marketingStrategy": "High-level marketing approach"
  },
  "competitiveAdvantage": {
    "dataMoat": "How data creates competitive advantage",
    "networkEffects": "Any network effects in the business",
    "switchingCosts": "Factors that create customer stickiness",
    "uniqueAssets": "Proprietary assets or capabilities"
  }
}

**Core Principles:**
- Strategic & Analytical: Focus on business model viability
- Data-Driven: Ground recommendations in research insights
- Scalable: Design for growth and expansion
- Defensible: Create sustainable competitive advantages

Generate comprehensive business blueprint now.`;async function A(a){try{let b,c=await (0,v.getServerSession)(w.N);if(!c?.user?.email)return u.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:d}=await a.json();if(!d)return u.NextResponse.json({error:"Project ID is required"},{status:400});let e=await x.z.user.findUnique({where:{email:c.user.email}});if(!e)return u.NextResponse.json({error:"User not found"},{status:404});if(e.credits<15)return u.NextResponse.json({error:"Insufficient credits",required:15,current:e.credits},{status:402});let f=await x.z.project.findFirst({where:{id:d,userId:e.id}});if(!f)return u.NextResponse.json({error:"Project not found"},{status:404});if(!f.researchOutput)return u.NextResponse.json({error:"Research must be completed before creating blueprint"},{status:400});let g=await y.N.chat.completions.create({model:"gpt-4",messages:[{role:"system",content:z.replace("{research_report}",JSON.stringify(f.researchOutput))},{role:"user",content:"Please create a comprehensive business blueprint based on the research data."}],temperature:.7,max_tokens:3500}),h=g.choices[0]?.message?.content;if(!h)throw Error("No response from AI");try{b=JSON.parse(h)}catch(a){b={coreBusinessModel:{model:"To be determined",rationale:h.substring(0,200)+"..."},revenueStreams:[],valuePropositions:[],operationalPlan:{coreOperations:[],technologyStack:{frontend:"To be determined",backend:"To be determined",database:"To be determined",ai_ml:"To be determined"},qualityControl:{kpis:[],qualityMetrics:"To be defined",scalingPlan:"To be developed"}},goToMarketStrategy:{primaryChannels:[],customerAcquisition:"To be defined",partnerships:"To be explored",marketingStrategy:"To be developed"},competitiveAdvantage:{dataMoat:"To be established",networkEffects:"To be analyzed",switchingCosts:"To be created",uniqueAssets:"To be developed"}}}return await x.z.$transaction([x.z.project.update({where:{id:d},data:{blueprintOutput:b,updatedAt:new Date}}),x.z.user.update({where:{id:e.id},data:{credits:e.credits-15}})]),u.NextResponse.json({success:!0,result:b,creditsUsed:15,creditsRemaining:e.credits-15})}catch(a){return console.error("Error in blueprint:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let B=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/forge/blueprint/route",pathname:"/api/forge/blueprint",filename:"route",bundlePath:"app/api/forge/blueprint/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/forge/blueprint/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:C,workUnitAsyncStorage:D,serverHooks:E}=B;function F(){return(0,g.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:D})}async function G(a,b,c){var d;let e="/api/forge/blueprint/route";"/index"===e&&(e="/");let g=await B.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||B.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===B.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>B.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>B.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await B.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await B.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await B.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},81630:a=>{"use strict";a.exports=require("http")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},94735:a=>{"use strict";a.exports=require("events")},94747:(a,b,c)=>{"use strict";c.d(b,{z:()=>e});let d=require("@prisma/client"),e=globalThis.prisma??new d.PrismaClient},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[602,446,190,694],()=>b(b.s=80395));module.exports=c})();