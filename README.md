# VentureForge AI 🚀

> Revolutionizing Idea-to-Launch with AI-Powered Business Intelligence

VentureForge AI is an innovative platform that transforms your business ideas into comprehensive, investor-ready business plans using advanced AI. From initial concept to detailed financial projections, our AI guides you through every step of the business planning process.

## ✨ Features

- **🧠 AI-Powered Business Planning**: 6 specialized AI modules for complete business development
- **💳 Credit-Based System**: Fair usage model with transparent pricing
- **📊 Professional Dashboard**: Clean, data-centric interface inspired by Stripe and Linear
- **🔄 Step-by-Step Workflow**: Guided journey from idea to investor pitch
- **🔒 Secure**: All API keys protected on backend, OAuth authentication
- **📱 Responsive**: Works perfectly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd venture-forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 AI Modules

### 1. ✨ Idea Spark (5 credits)
Generate 3 unique, viable business ideas based on your input

### 2. 🔍 Deep Research (10 credits)
Comprehensive market analysis and competitive landscape

### 3. 📋 Blueprint Architect (15 credits)
Business model formulation and strategic planning

### 4. 💰 Financial Forecaster (12 credits)
3-year financial projections and funding requirements

### 5. 🎯 Pitch Perfect (8 credits)
Investor-ready presentation and executive summary

### 6. 🚀 Go-to-Market (10 credits)
Launch strategy and customer acquisition plan

## 📊 Credit System

- **New users**: Start with 25 free credits
- **Fair usage**: Pay only for what you use
- **Transparent pricing**: Clear credit costs for each module
- **No hidden fees**: Credits deducted only after successful generation

## 🔧 API Endpoints

### Projects
- `POST /api/projects` - Create new project
- `GET /api/projects` - List user projects
- `GET /api/projects/[id]` - Get specific project

### AI Modules
- `POST /api/forge/idea-spark` - Generate business ideas
- `POST /api/forge/research` - Market research analysis
- `POST /api/forge/blueprint` - Business model creation
- `POST /api/forge/financials` - Financial projections
- `POST /api/forge/pitch` - Investor pitch generation
- `POST /api/forge/gtm` - Go-to-market strategy

## 🗄️ Database Schema

```prisma
model User {
  id               String   @id @default(cuid())
  email            String   @unique
  name             String?
  credits          Int      @default(25)
  subscriptionPlan Plan     @default(FREE)
  projects         Project[]
}

model Project {
  id              String @id @default(cuid())
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

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### Environment Variables for Production
- `DATABASE_URL` - Production PostgreSQL connection string
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Secure random string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `OPENAI_API_KEY` - OpenAI API key

## 📈 Development Status

**Phase 1 (MVP)**: ✅ Core infrastructure complete
- [x] Authentication & user management
- [x] Project creation & management
- [x] Idea Spark AI module
- [x] Credit system implementation
- [ ] Additional AI modules (in progress)

**Phase 2 (Monetization)**: 🔄 Planned
- [ ] Stripe payment integration
- [ ] Subscription plans
- [ ] React Native mobile app

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ventureforge.ai or join our Discord community.

---

**Built with ❤️ by the VentureForge team**