"use strict";(()=>{var a={};a.id=1607,a.ids=[1607],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{a.exports=require("querystring")},12412:a=>{a.exports=require("assert")},20364:(a,b,c)=>{c.d(b,{U:()=>e});var d=c(31183);class e{static async trackUsage({userId:a,action:b,creditsUsed:c,projectId:e,projectName:f,metadata:g={}}){try{let h=await d.z.user.findUnique({where:{id:a},select:{credits:!0,totalCreditsUsed:!0}});if(!h)throw Error("User not found for usage tracking");let i=h.credits-c,j=h.totalCreditsUsed+c;await d.z.$transaction([d.z.usageHistory.create({data:{userId:a,action:b,projectId:e,projectName:f,creditsUsed:c,creditsBalance:i,metadata:{...g,timestamp:new Date().toISOString(),userAgent:g.userAgent||"unknown"}}}),d.z.user.update({where:{id:a},data:{credits:i,totalCreditsUsed:j}})]),console.log(`Tracked usage: ${b} for user ${a} (${c} credits)`)}catch(a){console.error("Failed to track usage:",a)}}static async getUserUsageHistory(a,b=50,c=0){try{return await d.z.usageHistory.findMany({where:{userId:a},orderBy:{createdAt:"desc"},take:b,skip:c,select:{id:!0,action:!0,projectName:!0,creditsUsed:!0,creditsBalance:!0,createdAt:!0,metadata:!0}})}catch(a){return console.error("Failed to get usage history:",a),[]}}static async getUserUsageSummary(a){try{let[b,c]=await Promise.all([d.z.user.findUnique({where:{id:a},select:{credits:!0,totalCreditsUsed:!0,subscriptionPlan:!0,createdAt:!0}}),d.z.usageHistory.groupBy({by:["action"],where:{userId:a},_sum:{creditsUsed:!0},_count:{action:!0}})]);if(!b)throw Error("User not found");let e=c.reduce((a,b)=>(a[b.action]={count:b._count.action,totalCredits:b._sum.creditsUsed||0},a),{});return{currentCredits:b.credits,totalCreditsUsed:b.totalCreditsUsed,subscriptionPlan:b.subscriptionPlan,memberSince:b.createdAt,usageByAction:e}}catch(a){return console.error("Failed to get usage summary:",a),null}}static async checkCredits(a,b){try{let c=await d.z.user.findUnique({where:{id:a},select:{credits:!0}});return!!c&&c.credits>=b}catch(a){return console.error("Failed to check credits:",a),!1}}static async getCreditUsageTrends(a,b=30){try{let c=new Date;return c.setDate(c.getDate()-b),(await d.z.usageHistory.groupBy({by:["createdAt"],where:{userId:a,createdAt:{gte:c}},_sum:{creditsUsed:!0},orderBy:{createdAt:"asc"}})).reduce((a,b)=>{let c=b.createdAt.toISOString().split("T")[0];return a[c]=(a[c]||0)+(b._sum.creditsUsed||0),a},{})}catch(a){return console.error("Failed to get usage trends:",a),{}}}static async cleanupOldUsageHistory(a,b=90){try{let c=new Date;c.setDate(c.getDate()-b);let e=await d.z.usageHistory.deleteMany({where:{userId:a,createdAt:{lt:c}}});return console.log(`Cleaned up ${e.count} old usage records for user ${a}`),e.count}catch(a){return console.error("Failed to cleanup usage history:",a),0}}}},28354:a=>{a.exports=require("util")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{a.exports=require("crypto")},55591:a=>{a.exports=require("https")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{a.exports=require("zlib")},79428:a=>{a.exports=require("buffer")},79551:a=>{a.exports=require("url")},80395:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>J,patchFetch:()=>I,routeModule:()=>E,serverHooks:()=>H,workAsyncStorage:()=>F,workUnitAsyncStorage:()=>G});var d={};c.r(d),c.d(d,{POST:()=>D,maxDuration:()=>B});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(19854),w=c(12909),x=c(31183),y=c(81849),z=c(74339),A=c(20364);let B=300,C=`You are the 'Blueprint Architect' module of VentureForge AI, an elite business strategist and operational architect.

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

Generate a comprehensive, execution-ready business blueprint now. Return ONLY the JSON object.`;async function D(a){try{let b,c=await (0,v.getServerSession)(w.N);if(!c?.user?.email)return u.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:d}=await a.json();if(!d)return u.NextResponse.json({error:"Project ID is required"},{status:400});let e=await x.z.user.findUnique({where:{email:c.user.email}});if(!e)return u.NextResponse.json({error:"User not found"},{status:404});if(!await A.U.checkCredits(e.id,15))return u.NextResponse.json({error:"Insufficient credits",required:15,current:e.credits},{status:402});let f=await x.z.project.findFirst({where:{id:d,userId:e.id}});if(!f)return u.NextResponse.json({error:"Project not found"},{status:404});if(f.expiresAt&&f.expiresAt<new Date)return u.NextResponse.json({error:"Project has expired"},{status:404});let g=await z.R.getProjectSession(d,e.id);if(g||(await z.R.createProjectSession(e.id,f.name,"PERSISTENT"===f.storageMode,f.expiresAt||void 0,f.id),g=await z.R.getProjectSession(d,e.id)),!g)return u.NextResponse.json({error:"Failed to initialize project session"},{status:500});if(!g.data.researchOutput)return u.NextResponse.json({error:"Research must be completed before creating blueprint"},{status:400});let h=g.data.researchOutput;console.log(`[BLUEPRINT] Starting blueprint generation for project ${d}`);let i=C.replace("{research_report}",JSON.stringify(h)),j="Please create a comprehensive business blueprint based on the research data.",k=[{prompt:i+"\n\nPHASE 1: Focus on executive summary, core business model, and revenue architecture only.",userPrompt:j+" Return only executiveSummary, coreBusinessModel, and revenueArchitecture sections.",context:{phase:1,research:h}},{prompt:i+"\n\nPHASE 2: Focus on customer strategy and operational blueprint.",userPrompt:j+" Return only customerStrategy and operationalBlueprint sections.",context:{phase:2}},{prompt:i+"\n\nPHASE 3: Focus on go-to-market execution, competitive strategy, and risk management.",userPrompt:j+" Return only goToMarketExecution, competitiveStrategy, and riskManagement sections.",context:{phase:3}}],l=await y.U.generateInPhases(k,{maxRetries:3,timeoutMs:18e4,backoffMs:2e3});if(l.successful){console.log("[BLUEPRINT] Phased generation completed successfully");let a={};for(let b=0;b<l.phases.length;b++){let c=l.phases[b];if(c.successful){let b=y.U.parseJSONResponse(c.content);b.success&&Object.assign(a,b.parsed)}}if(Object.keys(a).length>0)b=a;else{console.warn("[BLUEPRINT] Phase parsing failed, trying full response");let a=y.U.parseJSONResponse(l.combinedContent);a.success?b=a.parsed:(b=y.U.createFallbackResponse("blueprint",i))._originalResponse=l.combinedContent.substring(0,500)}}else console.error("[BLUEPRINT] Phased generation failed"),(b=y.U.createFallbackResponse("blueprint",i))._phasedGeneration=!0,b._phaseResults=l.phases.map(a=>({successful:a.successful,retryCount:a.retryCount}));if(!await z.R.updateProjectData(d,e.id,"blueprintOutput",b))return u.NextResponse.json({error:"Failed to update project data"},{status:500});return await A.U.trackUsage({userId:e.id,action:"BLUEPRINT",creditsUsed:15,projectId:d,projectName:g.name,metadata:{aiModel:"gpt-4",phasedGeneration:l.successful,phaseCount:l.phases.length}}),u.NextResponse.json({success:!0,result:b,creditsUsed:15,creditsRemaining:e.credits-15})}catch(a){return console.error("Error in blueprint:",a),u.NextResponse.json({error:"Internal server error"},{status:500})}}let E=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/forge/blueprint/route",pathname:"/api/forge/blueprint",filename:"route",bundlePath:"app/api/forge/blueprint/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/forge/blueprint/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:F,workUnitAsyncStorage:G,serverHooks:H}=E;function I(){return(0,g.patchFetch)({workAsyncStorage:F,workUnitAsyncStorage:G})}async function J(a,b,c){var d;let e="/api/forge/blueprint/route";"/index"===e&&(e="/");let g=await E.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,D=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[D]||y.routes[C]);if(F&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[D];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||E.isDev||x||(G="/index"===(G=C)?"/":G);let H=!0===E.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>E.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>E.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await E.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await E.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await E.onRequestError(a,b,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},81630:a=>{a.exports=require("http")},81849:(a,b,c)=>{c.d(b,{U:()=>h});var d=c(37449);if(!process.env.GEMINI_API_KEY)throw Error("GEMINI_API_KEY is not set in environment variables");let e=new d.ij(process.env.GEMINI_API_KEY),f=e.getGenerativeModel({model:"gemini-2.0-flash-exp",generationConfig:{maxOutputTokens:8192,temperature:.7}});e.getGenerativeModel({model:"gemini-1.5-pro",generationConfig:{maxOutputTokens:8192,temperature:.5}}),e.getGenerativeModel({model:"gemini-1.5-flash",generationConfig:{maxOutputTokens:8192,temperature:.7}});let g={maxRetries:3,timeoutMs:3e5,backoffMs:2e3};class h{static async delay(a){return new Promise(b=>setTimeout(b,a))}static async makeGeminiRequest(a,b,c){let d=f.generateContent([a,b]),e=new Promise((a,b)=>setTimeout(()=>b(Error("Request timeout")),c));return(await Promise.race([d,e])).response.text()}static async generateWithRetry(a){let b={...g,...a.retryConfig},c=null,d=0;for(let e=0;e<=b.maxRetries;e++)try{console.log(`[AI_SERVICE] Attempt ${e+1}/${b.maxRetries+1}`);let c=await this.makeGeminiRequest(a.prompt,a.userPrompt,b.timeoutMs);if(!c)throw Error("Empty response from AI service");return console.log(`[AI_SERVICE] Success on attempt ${e+1}`),{content:c,retryCount:e,successful:!0}}catch(a){if(c=a,d=e,console.warn(`[AI_SERVICE] Attempt ${e+1} failed:`,c.message),e<b.maxRetries){let a=b.backoffMs*Math.pow(2,e);console.log(`[AI_SERVICE] Retrying in ${a}ms...`),await this.delay(a)}}return console.error(`[AI_SERVICE] All ${b.maxRetries+1} attempts failed. Last error:`,c?.message),{content:"",retryCount:d,successful:!1}}static async generateInPhases(a,b){let c=[],d="",e=!0;for(let f=0;f<a.length;f++){let g=a[f];console.log(`[AI_SERVICE] Starting phase ${f+1}/${a.length}`);let h=g.prompt;(g.context||d)&&(h+=`

**CONTEXT FROM PREVIOUS PHASES:**
${JSON.stringify(g.context||d.substring(0,1e3))}`);let i=await this.generateWithRetry({prompt:h,userPrompt:g.userPrompt,retryConfig:b});c.push(i),i.successful?d+=i.content+"\n\n":(console.error(`[AI_SERVICE] Phase ${f+1} failed, continuing with partial results`),e=!1)}return{phases:c,combinedContent:d.trim(),successful:e}}static parseJSONResponse(a){try{let b=a.replace(/```json\n?|\n?```/g,"").trim();return{parsed:JSON.parse(b),success:!0}}catch(b){return console.error("[AI_SERVICE] JSON parsing error:",b),console.error("[AI_SERVICE] Raw response:",a.substring(0,500)),{parsed:null,success:!1,error:`JSON parsing failed: ${b.message}`}}}static createFallbackResponse(a,b){let c=new Date().toISOString();return({research:{marketLandscape:{totalAddressableMarket:"Analysis in progress - AI service temporarily unavailable",serviceableAddressableMarket:"To be determined when service recovers",marketGrowthRate:"Pending analysis",keyTrends:"Market research will be completed when AI service is restored"},targetCustomerAnalysis:{primarySegment:"Customer analysis pending",customerPainPoints:["Analysis interrupted - will complete when service is restored"],buyingBehavior:"Research in progress"},competitiveLandscape:{mainCompetitors:["Analysis will be completed when AI service recovers"],competitiveGap:"Detailed analysis pending service restoration"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - analysis will be completed when service is restored"},blueprint:{executiveSummary:{businessConcept:"Business analysis interrupted - will be completed when AI service is restored",marketOpportunity:"Analysis pending",uniqueAdvantage:"To be determined",revenueProjection:"Financial analysis will be completed when service recovers"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - blueprint will be completed when service is restored"},financials:{keyAssumptions:[{assumption:"Analysis Pending",value:"To be calculated when AI service is restored",justification:"Financial modeling interrupted - will complete when service is available"}],_fallback:!0,_timestamp:c,_reason:"AI service timeout - financial projections will be completed when service is restored"},pitch:{executiveSummary:"Pitch development interrupted - will be completed when AI service is restored",pitchDeckSlides:{problemSlide:{headline:"Analysis in Progress",problemStatement:"Pitch development will be completed when AI service is restored"}},_fallback:!0,_timestamp:c,_reason:"AI service timeout - investor pitch will be completed when service is restored"},gtm:{strategicOverview:{gtmThesis:"Go-to-market analysis interrupted - will be completed when AI service is restored",marketEntryStrategy:"Analysis pending",primaryObjective:"Strategy development will resume when service is available"},_fallback:!0,_timestamp:c,_reason:"AI service timeout - GTM strategy will be completed when service is restored"}})[a]||{message:"Analysis in progress - will be completed when AI service is restored",_fallback:!0,_timestamp:c,_moduleType:a}}}},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")},94735:a=>{a.exports=require("events")},96330:a=>{a.exports=require("@prisma/client")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[2073,4446,2190,7449,1771],()=>b(b.s=80395));module.exports=c})();