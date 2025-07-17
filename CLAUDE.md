# VentureForge AI - Project Context & Status

## Project Overview

VentureForge AI is an AI-powered business planning tool that guides users through a structured 6-step process to transform initial ideas into comprehensive, investor-ready business plans. The application follows a modular approach with distinct AI modules:

1. **Idea Spark** → Generate 3 unique business ideas based on user input
2. **Deep Research** → Comprehensive market analysis and competitor research  
3. **Blueprint Architect** → Business model and strategic plan formulation
4. **Financial Forecaster** → 3-year financial projections and funding analysis
5. **Pitch Perfect** → Investor-ready pitch deck and executive summary
6. **Go-to-Market** → 6-month GTM strategy with actionable tactics

## Technical Architecture

### Stack
- **Frontend**: Next.js 15.4.1 with App Router, React, TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Deployment**: Vercel with serverless functions
- **AI Integration**: OpenAI (GPT-4) + Google Gemini (for research module)
- **Payments**: Stripe (planned for Phase 2)

### Key Features Implemented
- ✅ Google OAuth authentication
- ✅ Credit-based monetization system (100 initial credits)
- ✅ Project creation and management
- ✅ All 6 AI modules with API endpoints
- ✅ Intuitive step-by-step UI with progress tracking
- ✅ Gemini AI integration for research (cost-effective, 5-minute timeout)
- ✅ User flow improvements (idea selection before advancement)

## Current Status

### Recently Completed (Last Session)
1. **OAuth Authentication Issues** - Fixed Google OAuth client configuration
2. **UI/UX Overhaul** - Complete dashboard redesign with modern styling
3. **Credit System** - Increased from 25 to 100 initial credits for testing
4. **Gemini Integration** - Replaced OpenAI with Gemini for research module
5. **User Flow Fixes** - Resolved issue where users couldn't select ideas before advancing

### Database Schema
```prisma
model User {
  id               String    @id @default(cuid())
  email            String?   @unique
  credits          Int       @default(100)
  subscriptionPlan Plan      @default(FREE)
  projects         Project[]
  // ... auth fields
}

model Project {
  id              String   @id @default(cuid())
  name            String
  userId          String
  ideaOutput      Json?
  researchOutput  Json?
  blueprintOutput Json?
  financialOutput Json?
  pitchOutput     Json?
  gtmOutput       Json?
}
```

### API Endpoints
- `POST /api/forge/idea-spark` - Generate 3 business ideas (5 credits)
- `POST /api/forge/research-gemini` - Market research via Gemini (5 credits)
- `POST /api/forge/blueprint` - Business model generation (15 credits)
- `POST /api/forge/financials` - Financial projections (12 credits)
- `POST /api/forge/pitch` - Investor pitch creation (8 credits)
- `POST /api/forge/gtm` - Go-to-market strategy (10 credits)
- `GET /api/projects/[id]` - Fetch project details
- `POST /api/admin/update-credits` - Admin credit adjustment

### Key Files
- `src/app/dashboard/page.tsx` - Main dashboard with modern UI
- `src/app/projects/[id]/page.tsx` - Project workspace with 6-step flow
- `src/lib/auth.ts` - NextAuth configuration (100 initial credits)
- `src/lib/gemini.ts` - Gemini AI client setup
- `src/app/api/forge/research-gemini/route.ts` - Gemini research endpoint
- `vercel.json` - Deployment configuration with extended timeouts

## Environment Variables
```env
NEXTAUTH_URL=https://venture-forge-mayertobias-mayertobias-projects.vercel.app
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=your-postgres-connection-string
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=AIzaSyD_qau8icaf2_x0rosWtUVGtlz0zBhx3ag
```

## Development Roadmap

### Phase 1: MVP (Current) ✅
- [x] Core authentication and user management
- [x] All 6 AI modules implemented and tested
- [x] Credit system with proper deduction
- [x] Responsive UI with step-by-step guidance
- [x] Database schema and API endpoints
- [x] Vercel deployment with proper timeouts

### Phase 2: Monetization (Next Priority)
- [ ] Stripe integration for subscriptions
- [ ] Credit top-up functionality
- [ ] Subscription plan management (FREE/FORGE/ACCELERATOR)
- [ ] Payment webhooks and billing logic
- [ ] Usage analytics and monitoring

### Phase 3: Mobile & Enhancement
- [ ] React Native (Expo) mobile app
- [ ] PDF/DocX export functionality
- [ ] Project management features (delete, rename, duplicate)
- [ ] Partner marketplace integration
- [ ] Advanced analytics dashboard

## Known Issues & TODOs

### High Priority
1. **Stripe Integration**: Payment system not yet implemented
2. **Credit Enforcement**: Need to add credit validation on all endpoints
3. **Error Handling**: Improve user experience for API failures
4. **Mobile Responsiveness**: Test and optimize for mobile devices

### Medium Priority
1. **Export Functionality**: PDF/DocX generation for final business plans
2. **Project Management**: Bulk operations and project organization
3. **Admin Dashboard**: User management and analytics
4. **Rate Limiting**: Prevent abuse of AI endpoints

### Low Priority
1. **Email Notifications**: Project completion and credit alerts
2. **Collaboration Features**: Team sharing and commenting
3. **Templates**: Pre-built industry-specific templates
4. **AI Model Selection**: Allow users to choose between AI providers

## User Flow Analysis

### Current Working Flow
1. User signs up via Google OAuth (100 credits)
2. Creates new project from dashboard
3. Navigates through 6 steps sequentially:
   - Idea Spark: Input concept → AI generates 3 ideas → User selects one
   - Research: Conducts market analysis on selected idea
   - Blueprint: Creates business model and strategy
   - Financials: Generates 3-year projections
   - Pitch: Creates investor presentation
   - GTM: Develops go-to-market strategy

### Recent Flow Improvements
- Fixed auto-advancement issue where users couldn't select ideas
- Added "Continue to Research" button after idea selection
- Added "Back to Ideas" and "Change Idea" buttons in research step
- Improved step navigation with clear progress indicators

## Testing & Deployment

### Current Deployment
- **URL**: https://venture-forge-mayertobias-mayertobias-projects.vercel.app
- **Status**: Functional with all 6 modules working
- **Performance**: 5-minute timeout for research module, 2-minute for others

### Testing Checklist
- [x] Google OAuth authentication works
- [x] All 6 AI modules generate content
- [x] Credit system deducts properly
- [x] User flow navigation works correctly
- [x] Mobile responsiveness (basic)
- [ ] Stripe payment integration
- [ ] Load testing for concurrent users
- [ ] Error handling edge cases

## Business Model

### Credit Pricing
- Idea Spark: 5 credits
- Deep Research: 5 credits (Gemini)
- Blueprint: 15 credits
- Financials: 12 credits
- Pitch: 8 credits
- GTM: 10 credits
- **Total per complete project**: 55 credits

### Subscription Plans (Planned)
- **FREE**: 100 credits/month
- **FORGE**: ~$29/month with additional credits
- **ACCELERATOR**: ~$99/month with unlimited credits + premium features

## AI Integration Details

### OpenAI Integration
- **Model**: GPT-4 for most modules
- **Cost**: Higher per token, used for complex business planning
- **Timeout**: 2 minutes for most endpoints

### Gemini Integration
- **Model**: Gemini-1.5-flash
- **Usage**: Research module only (cost optimization)
- **Cost**: 50% cheaper than OpenAI for research tasks
- **Timeout**: 5 minutes for deep research

## Security & Best Practices

### Security Measures
- ✅ All API keys stored server-side only
- ✅ User authentication required for all actions
- ✅ Credit validation before AI calls
- ✅ Rate limiting via credit system
- ✅ HTTPS everywhere with Vercel

### Code Quality
- ✅ TypeScript for type safety
- ✅ Prisma for database type safety
- ✅ ESLint and Prettier configured
- ✅ Component-based architecture
- ✅ Proper error handling in API routes

## Next Steps

### Immediate Actions (Week 1)
1. Add Gemini API key to Vercel environment variables
2. Test end-to-end flow with real users
3. Implement Stripe payment integration
4. Add proper error handling for AI failures

### Short Term (Month 1)
1. Complete Phase 2 monetization features
2. Implement project management features
3. Add PDF export functionality
4. Mobile app development start

### Long Term (Months 2-3)
1. React Native app launch
2. Advanced analytics and reporting
3. Enterprise features and team collaboration
4. API for third-party integrations

## Contact & Support

For technical issues or questions about the codebase, refer to:
- Project documentation in `blueprint.md` and `engg.md`
- API documentation in individual route files
- Component documentation in respective TypeScript files

---

*Last updated: July 2024*
*Status: MVP Complete, Ready for Phase 2 Monetization*