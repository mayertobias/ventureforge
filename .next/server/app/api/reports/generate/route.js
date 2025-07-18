(()=>{var a={};a.id=671,a.ids=[671],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{"use strict";a.exports=require("querystring")},11785:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{A:()=>h});var e=c(83636),f=a([e]);e=(f.then?(await f)():f)[0];class g{static formatCurrency(a){if("string"==typeof a){let b=a.replace(/[$,]/g,"");if(b.includes("M"))return`$${parseFloat(b.replace("M",""))}M`;if(b.includes("K"))return`$${parseFloat(b.replace("K",""))}K`;let c=parseFloat(b);if(!isNaN(c))return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0}).format(c)}return a.toString()}static extractFinancialMetrics(a){let b=a.financialOutput;return b?{seedFunding:this.formatCurrency(b.fundingAnalysis?.seedFunding||"$1,500,000"),year3Revenue:this.formatCurrency(b.threeYearProjections?.year3?.totalRevenue||"TBD"),breakEvenMonth:b.pathToProfitability?.breakEvenMonth||"Month 18",ltv:this.formatCurrency(b.keyMetrics?.ltv||"$5,000"),cac:this.formatCurrency(b.keyMetrics?.cac||"$500"),grossMargin:b.threeYearProjections?.year3?.grossMargin||"75%"}:null}static generateExecutiveSummary(a){let b=a.ideaOutput?.selectedIdea,c=a.researchOutput,d=a.blueprintOutput,e=a.financialOutput,f=b?.title||a.name,g=c?.marketLandscape?.totalAddressableMarket||"Significant market opportunity",h=d?.executiveSummary?.uniqueAdvantage||"Innovative solution",i=e?.threeYearProjections?.year3?.totalRevenue||"Strong growth potential";return`${f} addresses ${g} with ${h}. Our financial projections show ${i} by Year 3, making this an attractive investment opportunity with significant potential for returns.`}static generateHTML(a,b){let c=this.extractFinancialMetrics(a),d=this.generateExecutiveSummary(a),e=b.branding?.primaryColor||"#3B82F6",f=b.branding?.companyName||a.name;return`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${f} - Business Plan</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .header {
            background: linear-gradient(135deg, ${e} 0%, #1e40af 100%);
            color: white;
            padding: 60px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="30"/></g></svg>') repeat;
            opacity: 0.1;
        }
        
        .header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .section {
            padding: 80px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .section:last-child { border-bottom: none; }
        
        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 30px;
            color: #111827;
            text-align: center;
        }
        
        .executive-summary {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 60px;
            border-radius: 20px;
            margin: 40px 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .executive-summary h2 {
            color: ${e};
            font-size: 2rem;
            margin-bottom: 20px;
        }
        
        .executive-summary p {
            font-size: 1.2rem;
            line-height: 1.8;
            color: #374151;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        
        .metric-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .metric-value {
            font-size: 2.5rem;
            font-weight: 800;
            color: ${e};
            margin-bottom: 10px;
        }
        
        .metric-label {
            font-size: 1rem;
            color: #6b7280;
            font-weight: 500;
        }
        
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
            margin: 40px 0;
        }
        
        .content-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-left: 5px solid ${e};
        }
        
        .content-card h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: #111827;
        }
        
        .content-card ul {
            list-style: none;
            padding: 0;
        }
        
        .content-card li {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
            color: #374151;
        }
        
        .content-card li:last-child { border-bottom: none; }
        
        .chart-container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            margin: 40px 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .chart-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 30px;
            text-align: center;
            color: #111827;
        }
        
        .footer {
            background: #1f2937;
            color: white;
            text-align: center;
            padding: 40px 0;
            margin-top: 80px;
        }
        
        .generated-by {
            opacity: 0.7;
            font-size: 0.9rem;
        }
        
        @media print {
            .header { background: ${e} !important; }
            .section { page-break-inside: avoid; }
            .metric-card, .content-card { break-inside: avoid; }
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2.5rem; }
            .metrics-grid { grid-template-columns: 1fr; }
            .content-grid { grid-template-columns: 1fr; }
            .executive-summary { padding: 30px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${f}</h1>
            <p class="subtitle">Comprehensive Business Plan & Investment Proposal</p>
        </div>
    </div>

    <div class="container">
        <div class="executive-summary">
            <h2>Executive Summary</h2>
            <p>${d}</p>
        </div>

        ${c?`
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">${c.seedFunding}</div>
                <div class="metric-label">Seed Funding Target</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${c.year3Revenue}</div>
                <div class="metric-label">Year 3 Revenue Projection</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${c.grossMargin}</div>
                <div class="metric-label">Gross Margin</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${c.breakEvenMonth}</div>
                <div class="metric-label">Break-Even Timeline</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${c.ltv}</div>
                <div class="metric-label">Customer LTV</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${c.cac}</div>
                <div class="metric-label">Customer CAC</div>
            </div>
        </div>
        `:""}

        ${a.researchOutput?`
        <div class="section">
            <h2 class="section-title">Market Research & Analysis</h2>
            <div class="content-grid">
                <div class="content-card">
                    <h3>Market Landscape</h3>
                    <ul>
                        <li><strong>Total Addressable Market:</strong> ${a.researchOutput.marketLandscape?.totalAddressableMarket||"Analyzing..."}</li>
                        <li><strong>Market Growth Rate:</strong> ${a.researchOutput.marketLandscape?.marketGrowthRate||"Analyzing..."}</li>
                        <li><strong>Key Trends:</strong> ${a.researchOutput.marketLandscape?.keyTrends||"Market analysis in progress"}</li>
                    </ul>
                </div>
                <div class="content-card">
                    <h3>Target Customer Analysis</h3>
                    <ul>
                        <li><strong>Primary Segment:</strong> ${a.researchOutput.targetCustomerAnalysis?.primarySegment||"Customer analysis in progress"}</li>
                        <li><strong>Segment Size:</strong> ${a.researchOutput.targetCustomerAnalysis?.segmentSize||"Analyzing..."}</li>
                        <li><strong>Customer LTV:</strong> ${a.researchOutput.targetCustomerAnalysis?.lifetimeValue||"Calculating..."}</li>
                    </ul>
                </div>
            </div>
        </div>
        `:""}

        ${a.blueprintOutput?`
        <div class="section">
            <h2 class="section-title">Business Strategy & Model</h2>
            <div class="content-grid">
                <div class="content-card">
                    <h3>Core Business Model</h3>
                    <ul>
                        <li><strong>Primary Model:</strong> ${a.blueprintOutput.coreBusinessModel?.primaryModel||"Strategy development in progress"}</li>
                        <li><strong>Revenue Logic:</strong> ${a.blueprintOutput.coreBusinessModel?.revenueLogic||"Business model analysis ongoing"}</li>
                    </ul>
                </div>
                <div class="content-card">
                    <h3>Competitive Advantages</h3>
                    <ul>
                        ${a.blueprintOutput.competitiveStrategy?.sustainableAdvantages?.map(a=>`<li><strong>${a.advantage}:</strong> ${a.description}</li>`).join("")||"<li>Competitive analysis in progress</li>"}
                    </ul>
                </div>
            </div>
        </div>
        `:""}

        ${b.includeCharts?`
        <div class="chart-container">
            <h3 class="chart-title">Financial Projections (3-Year)</h3>
            <canvas id="revenueChart" width="400" height="200"></canvas>
        </div>
        `:""}

        ${a.gtmOutput?`
        <div class="section">
            <h2 class="section-title">Go-to-Market Strategy</h2>
            <div class="content-grid">
                <div class="content-card">
                    <h3>Strategic Overview</h3>
                    <ul>
                        <li><strong>GTM Thesis:</strong> ${a.gtmOutput.strategicOverview?.gtmThesis||"Strategy development in progress"}</li>
                        <li><strong>Market Entry:</strong> ${a.gtmOutput.strategicOverview?.marketEntryStrategy||"Market entry planning ongoing"}</li>
                        <li><strong>Primary Objective:</strong> ${a.gtmOutput.strategicOverview?.primaryObjective||"Objectives being defined"}</li>
                    </ul>
                </div>
                <div class="content-card">
                    <h3>6-Month Targets</h3>
                    <ul>
                        <li><strong>Month 1 Revenue:</strong> ${a.gtmOutput.salesTargets?.month1||"TBD"}</li>
                        <li><strong>Month 3 Revenue:</strong> ${a.gtmOutput.salesTargets?.month3||"TBD"}</li>
                        <li><strong>Month 6 Revenue:</strong> ${a.gtmOutput.salesTargets?.month6||"TBD"}</li>
                    </ul>
                </div>
            </div>
        </div>
        `:""}
    </div>

    <div class="footer">
        <div class="container">
            <p class="generated-by">Generated by VentureForge AI • ${new Date().toLocaleDateString()}</p>
        </div>
    </div>

    ${b.includeCharts&&c?`
    <script>
        // Revenue Growth Chart
        const ctx = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3'],
                datasets: [{
                    label: 'Revenue Projection',
                    data: [500000, 2000000, 5000000], // Sample data - would be dynamic
                    borderColor: '${e}',
                    backgroundColor: '${e}20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });
    </script>
    `:""}
</body>
</html>`}static async generatePDF(a,b){let c,d=this.generateHTML(a,b);try{c=await e.default.launch({headless:!0,args:["--no-sandbox","--disable-setuid-sandbox"]});let a=await c.newPage();await a.setContent(d,{waitUntil:"networkidle0"}),b.includeCharts&&await new Promise(a=>setTimeout(a,2e3));let f=await a.pdf({format:"A4",printBackground:!0,margin:{top:"20mm",right:"20mm",bottom:"20mm",left:"20mm"}});return Buffer.from(f)}finally{c&&await c.close()}}}let h=g;d()}catch(a){d(a)}})},12412:a=>{"use strict";a.exports=require("assert")},12909:(a,b,c)=>{"use strict";c.d(b,{N:()=>f});var d=c(36344),e=c(94747);let f={providers:[(0,d.A)({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET})],callbacks:{async signIn({user:a,account:b,profile:c}){if(b?.provider==="google")try{await e.z.user.findUnique({where:{email:a.email}})||await e.z.user.create({data:{email:a.email,name:a.name,image:a.image,credits:100}})}catch(a){return console.error("Error creating user:",a),!1}return!0},async session({session:a,token:b}){if(a?.user?.email){let b=await e.z.user.findUnique({where:{email:a.user.email}});b&&a.user&&(a.user.id=b.id)}return a},jwt:async({user:a,token:b})=>b},session:{strategy:"jwt"},secret:process.env.NEXTAUTH_SECRET}},18571:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{handler:()=>x,patchFetch:()=>w,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(29783),v=a([u]);u=(v.then?(await v)():v)[0];let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/reports/generate/route",pathname:"/api/reports/generate",filename:"route",bundlePath:"app/api/reports/generate/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/manojveluchuri/saas/venture-forge/src/app/api/reports/generate/route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function w(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function x(a,b,c){var d;let e="/api/reports/generate/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G=D,G="/index"===G?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}d()}catch(a){d(a)}})},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},29783:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{POST:()=>k,maxDuration:()=>l});var e=c(32190),f=c(19854),g=c(12909),h=c(94747),i=c(11785),j=a([i]);i=(j.then?(await j)():j)[0];let l=120;async function k(a){let b="html",c=null,d="comprehensive",j=!0,k={};try{let l=await (0,f.getServerSession)(g.N);if(!l?.user?.email)return e.NextResponse.json({error:"Unauthorized"},{status:401});let{projectId:m,format:n,template:o,includeCharts:p,branding:q}=await a.json();if(b=n||"html",d=o||"comprehensive",j=!1!==p,k=q||{},!m)return e.NextResponse.json({error:"Project ID is required"},{status:400});let r=await h.z.user.findUnique({where:{email:l.user.email}});if(!r)return e.NextResponse.json({error:"User not found"},{status:404});if(!(c=await h.z.project.findFirst({where:{id:m,userId:r.id}})))return e.NextResponse.json({error:"Project not found"},{status:404});if(!c.ideaOutput)return e.NextResponse.json({error:"Project must have at least an idea to generate a report"},{status:400});let s={format:n||"html",template:d||"comprehensive",includeCharts:!1!==j,branding:k||{primaryColor:"#3B82F6",companyName:c.name}};if(console.log(`[REPORT] Generating ${s.format} report for project ${m}`),"pdf"===s.format){let a={...c,createdAt:c.createdAt.toISOString()},b=await i.A.generatePDF(a,s);return new e.NextResponse(b,{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${c.name}-business-plan.pdf"`,"Cache-Control":"no-cache"}})}{let a={...c,createdAt:c.createdAt.toISOString()},b=i.A.generateHTML(a,s);return new e.NextResponse(b,{headers:{"Content-Type":"text/html","Cache-Control":"no-cache"}})}}catch(a){if(console.error("Error generating report:",a),"pdf"===b)try{let a={...c,createdAt:c.createdAt.toISOString()},b=i.A.generateHTML(a,{format:"html",template:d||"comprehensive",includeCharts:!1!==j,branding:k||{primaryColor:"#3B82F6",companyName:c.name}});return new e.NextResponse(b,{headers:{"Content-Type":"text/html","Cache-Control":"no-cache"}})}catch(a){console.error("HTML fallback also failed:",a)}return e.NextResponse.json({error:"Failed to generate report",details:a instanceof Error?a.message:"Unknown error",note:"PDF generation not available in this environment. Please try HTML format."},{status:500})}}d()}catch(a){d(a)}})},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{"use strict";a.exports=require("crypto")},55591:a=>{"use strict";a.exports=require("https")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{"use strict";a.exports=require("zlib")},78335:()=>{},79428:a=>{"use strict";a.exports=require("buffer")},79551:a=>{"use strict";a.exports=require("url")},81630:a=>{"use strict";a.exports=require("http")},83636:a=>{"use strict";a.exports=import("puppeteer")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},94735:a=>{"use strict";a.exports=require("events")},94747:(a,b,c)=>{"use strict";c.d(b,{z:()=>e});let d=require("@prisma/client"),e=globalThis.prisma??new d.PrismaClient},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[602,446,190],()=>b(b.s=18571));module.exports=c})();