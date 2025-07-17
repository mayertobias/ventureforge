(()=>{var a={};a.id=920,a.ids=[920],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{"use strict";a.exports=require("querystring")},12412:a=>{"use strict";a.exports=require("assert")},12909:(a,b,c)=>{"use strict";c.d(b,{N:()=>f});var d=c(36344),e=c(94747);let f={providers:[(0,d.A)({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET})],callbacks:{async signIn({user:a,account:b,profile:c}){if(b?.provider==="google")try{await e.z.user.findUnique({where:{email:a.email}})||await e.z.user.create({data:{email:a.email,name:a.name,image:a.image,credits:100}})}catch(a){return console.error("Error creating user:",a),!1}return!0},async session({session:a,token:b}){if(a?.user?.email){let b=await e.z.user.findUnique({where:{email:a.user.email}});b&&a.user&&(a.user.id=b.id)}return a},jwt:async({user:a,token:b})=>b},session:{strategy:"jwt"},secret:process.env.NEXTAUTH_SECRET}},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33509:(a,b,c)=>{"use strict";c.d(b,{N:()=>d});let d=new(c(40694)).Ay({apiKey:process.env.OPENAI_API_KEY})},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{"use strict";a.exports=require("crypto")},55591:a=>{"use strict";a.exports=require("https")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{"use strict";a.exports=require("zlib")},78335:()=>{},79428:a=>{"use strict";a.exports=require("buffer")},79551:a=>{"use strict";a.exports=require("url")},80821:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>H,patchFetch:()=>G,routeModule:()=>C,serverHooks:()=>F,workAsyncStorage:()=>D,workUnitAsyncStorage:()=>E});var d={};c.r(d),c.d(d,{POST:()=>B,maxDuration:()=>z});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(19854),w=c(12909),x=c(94747),y=c(33509);let z=300,A=`You are the 'Go-to-Market Strategist' module of VentureForge AI.

**Task:** Based on the full business plan, create a detailed and actionable Go-to-Market (GTM) strategy for the first 6 months post-launch.

**INPUT:**
- full_business_plan: {full_business_plan}

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
{
  "preLaunch": {
    "timeline": "Month -1",
    "activities": [
      {
        "activity": "Build waitlist landing page",
        "goal": "Capture 500 interested leads",
        "channels": ["Product Hunt Upcoming", "BetaList", "relevant subreddits"],
        "budget": "$X,XXX",
        "success_metrics": ["500 signups", "20% conversion rate"]
      }
    ]
  },
  "launch": {
    "timeline": "Month 1", 
    "activities": [
      {
        "activity": "Official Product Hunt launch",
        "goal": "Top 5 product of the day",
        "channels": ["Product Hunt", "tech newsletters", "personal networks"],
        "budget": "$X,XXX",
        "success_metrics": ["Top 5 ranking", "1000 visitors", "50 signups"]
      }
    ]
  },
  "contentStrategy": {
    "timeline": "Months 1-6",
    "pillarContent": [
      {
        "type": "In-depth guides",
        "frequency": "1 per month",
        "example": "The Ultimate Guide to Market Sizing for Startups",
        "distribution": ["blog posts", "Twitter threads", "LinkedIn articles"]
      }
    ],
    "contentGoals": {
      "organicTraffic": "10,000 monthly visitors by Month 6",
      "leadGeneration": "500 qualified leads per month",
      "brandAwareness": "Establish thought leadership"
    }
  },
  "customerAcquisition": {
    "timeline": "Months 1-3",
    "targetPersona": "Primary target from business plan",
    "acquisitionTactics": [
      {
        "tactic": "Direct LinkedIn outreach",
        "description": "Personalized outreach to target personas",
        "volume": "100 messages per week",
        "conversionRate": "5% to demo",
        "cost": "$500/month"
      }
    ],
    "acquisitionGoals": {
      "paidCustomers": "20 from premium plan",
      "freemiumUsers": "200 active users",
      "pipeline": "$50k ARR pipeline"
    }
  },
  "partnerships": {
    "strategicPartners": [
      {
        "type": "Integration partners",
        "examples": ["Partner 1", "Partner 2"],
        "benefit": "Mutual customer value",
        "timeline": "Month 2-3"
      }
    ],
    "channelPartners": [
      {
        "type": "Affiliate program",
        "structure": "Revenue sharing model",
        "target": "Industry consultants",
        "timeline": "Month 4-6"
      }
    ]
  },
  "marketingChannels": {
    "paidChannels": [
      {
        "channel": "Google Ads",
        "budget": "$X,XXX/month",
        "targeting": "High-intent keywords",
        "expectedROI": "X:1 after 3 months"
      }
    ],
    "organicChannels": [
      {
        "channel": "SEO Content",
        "investment": "Time + content creation",
        "timeline": "3-6 months to see results",
        "expectedTraffic": "1000 visitors/month by Month 6"
      }
    ]
  },
  "salesProcess": {
    "salesFunnel": [
      {
        "stage": "Awareness",
        "tactics": ["Content marketing", "Social media"],
        "metrics": ["Website traffic", "Social media engagement"]
      },
      {
        "stage": "Interest", 
        "tactics": ["Lead magnets", "Webinars"],
        "metrics": ["Email signups", "Demo requests"]
      },
      {
        "stage": "Decision",
        "tactics": ["Product demos", "Free trials"],
        "metrics": ["Trial-to-paid conversion", "Sales velocity"]
      }
    ],
    "salesTargets": {
      "month1": "$5k ARR",
      "month3": "$25k ARR", 
      "month6": "$75k ARR"
    }
  },
  "keyMetrics": {
    "acquisitionMetrics": {
      "CAC": "$XXX",
      "LTV": "$X,XXX",
      "paybackPeriod": "XX months"
    },
    "engagementMetrics": {
      "DAU": "XXX users",
      "retention": "XX% monthly",
      "NPS": "XX+"
    },
    "revenueMetrics": {
      "MRR": "$XX,XXX by Month 6",
      "ARR": "$XXX,XXX by Month 6",
      "churnRate": "X% monthly"
    }
  }
}

**Core Principles:**
- Actionable: Provide specific tactics and timelines
- Measurable: Include clear success metrics
- Resource-Conscious: Consider budget and team constraints
- Market-Driven: Align with target customer behavior

Generate comprehensive 6-month GTM strategy now.`;async function B(a){try{let b,c=await (0,v.getServerSession)(w.N);if(!c?.user?.email)return u.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:d}=await a.json();if(!d)return u.NextResponse.json({error:"Project ID is required"},{status:400});let e=await x.z.user.findUnique({where:{email:c.user.email}});if(!e)return u.NextResponse.json({error:"User not found"},{status:404});if(e.credits<10)return u.NextResponse.json({error:"Insufficient credits",required:10,current:e.credits},{status:402});let f=await x.z.project.findFirst({where:{id:d,userId:e.id}});if(!f)return u.NextResponse.json({error:"Project not found"},{status:404});if(!f.pitchOutput)return u.NextResponse.json({error:"Investor pitch must be completed before GTM strategy"},{status:400});let g={idea:f.ideaOutput,research:f.researchOutput,blueprint:f.blueprintOutput,financials:f.financialOutput,pitch:f.pitchOutput},h=await y.N.chat.completions.create({model:"gpt-4",messages:[{role:"system",content:A.replace("{full_business_plan}",JSON.stringify(g))},{role:"user",content:"Please create a comprehensive 6-month go-to-market strategy based on the complete business plan."}],temperature:.7,max_tokens:4e3}),i=h.choices[0]?.message?.content;if(!i)throw Error("No response from AI");try{b=JSON.parse(i)}catch(a){b={preLaunch:{timeline:"Month -1",activities:[{activity:"Pre-launch preparation",goal:"Build awareness and waitlist",channels:["To be determined"],budget:"To be allocated",success_metrics:["To be defined"]}]},launch:{timeline:"Month 1",activities:[{activity:"Product launch",goal:"Market entry and initial traction",channels:["To be determined"],budget:"To be allocated",success_metrics:["To be defined"]}]},contentStrategy:{timeline:"Months 1-6",pillarContent:[],contentGoals:{organicTraffic:"To be targeted",leadGeneration:"To be planned",brandAwareness:"To be established"}},customerAcquisition:{timeline:"Months 1-3",targetPersona:"To be defined from research",acquisitionTactics:[],acquisitionGoals:{paidCustomers:"To be targeted",freemiumUsers:"To be planned",pipeline:"To be projected"}},partnerships:{strategicPartners:[],channelPartners:[]},marketingChannels:{paidChannels:[],organicChannels:[]},salesProcess:{salesFunnel:[],salesTargets:{month1:"To be set",month3:"To be targeted",month6:"To be achieved"}},keyMetrics:{acquisitionMetrics:{CAC:"To be calculated",LTV:"To be determined",paybackPeriod:"To be estimated"},engagementMetrics:{DAU:"To be tracked",retention:"To be measured",NPS:"To be surveyed"},revenueMetrics:{MRR:"To be built",ARR:"To be achieved",churnRate:"To be minimized"}}}}return await x.z.$transaction([x.z.project.update({where:{id:d},data:{gtmOutput:b,updatedAt:new Date}}),x.z.user.update({where:{id:e.id},data:{credits:e.credits-10}})]),u.NextResponse.json({success:!0,result:b,creditsUsed:10,creditsRemaining:e.credits-10})}catch(a){return console.error("Error in GTM:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let C=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/forge/gtm/route",pathname:"/api/forge/gtm",filename:"route",bundlePath:"app/api/forge/gtm/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/forge/gtm/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:D,workUnitAsyncStorage:E,serverHooks:F}=C;function G(){return(0,g.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:E})}async function H(a,b,c){var d;let e="/api/forge/gtm/route";"/index"===e&&(e="/");let g=await C.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||C.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===C.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>C.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>C.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await C.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await C.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await C.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},81630:a=>{"use strict";a.exports=require("http")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},94735:a=>{"use strict";a.exports=require("events")},94747:(a,b,c)=>{"use strict";c.d(b,{z:()=>e});let d=require("@prisma/client"),e=globalThis.prisma??new d.PrismaClient},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[602,446,190,694],()=>b(b.s=80821));module.exports=c})();