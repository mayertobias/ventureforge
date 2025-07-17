# **PROJECT BRIEF: VentureForge AI - Engineering & Development**

## **1. MANDATE & VISION**

You are the Lead Full-Stack Engineer for **VentureForge AI**. Your mission is to build the application that brings this powerful AI-driven business planning tool to life. You must build a product that is not only functional but also intuitive, secure, scalable, and, most importantly, **profitable from day one**. Think like a product owner and a business builder, not just a coder. Our success depends on your ability to translate the strategic vision into a world-class user experience and a robust technical foundation.

## **2. CORE USER EXPERIENCE (UX) PRINCIPLES**

The app must make the complex process of building a business feel structured, manageable, and empowering.

- **The Guided Journey:** The user should never feel lost. The UI must be a step-by-step guide. The core workflow follows the AI modules: `Idea -> Research -> Blueprint -> Financials -> Pitch -> GTM`.
- **Professional & Data-Centric UI:** The aesthetic must be clean, modern, and inspire confidence. Think Stripe, Linear, or Figma. Use a component library like **Shadcn/UI** for its clean, unstyled nature which gives us full control. Data visualizations (charts, tables) must be elegant and clear.
- **The Workspace:** The UI will be a single-page application (SPA) style with a persistent left-hand navigation sidebar for major sections (`Dashboard`, `Projects`, `Marketplace`, `Settings`) and a main content area that houses the step-by-step project builder.

## **3. TECHNICAL ARCHITECTURE & STACK**

We are building for speed, scalability, and cross-platform reach. The stack is non-negotiable.

- **Hosting & Backend:** **Vercel**. Its seamless Git integration, serverless functions, and global CDN are perfect for our needs.
- **Web Application:** **Next.js (App Router)**. We will use this for the main web application.
- **Mobile Apps (iOS/Android):** **React Native (with Expo)**. We will build a native shell that primarily wraps a web view of our responsive Next.js application for Phase 1 (MVP). This gives us instant mobile presence. True native screens can be added later where necessary.
- **Database:** **Postgres** (hosted on Vercel Postgres or Supabase).
- **ORM:** **Prisma**. It provides type-safety and simplifies database interactions.
- **Authentication:** **NextAuth.js** or **Clerk**. Choose the one that offers the fastest implementation for social (Google, GitHub) and password-based login.

## **4. SECURITY: THE NON-NEGOTIABLE RULE**

All communication with our underlying LLMs (and any other third-party APIs with secret keys) **MUST** be proxied through our own backend.

- **Workflow:**
  1.  The React/React Native client calls our Next.js API route (e.g., `/api/forge/generate-research`).
  2.  This serverless function, running on Vercel, authenticates the user, checks their credit balance, and then uses the `process.env.OPENAI_API_KEY` to call the LLM.
  3.  The function processes the response and sends a clean, safe JSON object back to the client.
- **NEVER** expose an API key to the browser. **NEVER** use `NEXT_PUBLIC_` for any secret.

## **5. MONETIZATION ENGINE: THE CREDIT SYSTEM**

This is the heart of our business model. Your implementation must be flawless.

- **UI Requirements:**
  - `[ ]` **Persistent Credit Counter:** The main UI header must always display the user's "Forge Credit" balance.
  - `[ ]` **Action Cost Preview:** Every button that triggers an LLM call must display the cost (e.g., `[ Generate Financials (10 Credits) ]`). This cost will be fetched from our backend.
  - `[ ]` **Confirmation Modals:** For actions costing >5 credits, show a confirmation modal.
  - `[ ]` **"Insufficient Credits" State:** If a user cannot afford an action, the button should be disabled or trigger a modal prompting them to "Upgrade Plan" or "Buy Credits".
- **Payment & Subscription:** Integrate **Stripe** for handling subscriptions and one-time credit pack purchases. Use Stripe Checkout for simplicity.

## **6. DATABASE SCHEMA (Prisma)**

Here is the initial schema. Create this in `prisma/schema.prisma`.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  projects      Project[]

  // Monetization
  stripeCustomerId String?   @unique
  subscriptionPlan Plan      @default(FREE)
  credits          Int       @default(25) // Starter credits
}

model Project {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // The actual content generated by the AI for each module
  ideaOutput      Json?
  researchOutput  Json?
  blueprintOutput Json?
  financialOutput Json?
  pitchOutput     Json?
  gtmOutput       Json?
}

// Models for NextAuth.js
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum Plan {
  FREE
  FORGE
  ACCELERATOR
}
```

## **7. DEVELOPMENT ROADMAP (PHASED ROLLOUT)**

We build an MVP first, validate, then expand.

### **Phase 1: Minimum Viable Product (Web App)**

**Goal:** A single user can sign up, create one project, and go through the entire AI generation flow using credits.

- `[ ]` **Setup Project:** Initialize Next.js (App Router), Prisma, and TailwindCSS.
- `[ ]` **Setup Database:** Connect to Vercel Postgres and run the initial Prisma migration.
- `[ ]` **Implement Authentication:** Set up NextAuth.js with Google provider.
- `[ ]` **Build Core UI Layout:** Create the main sidebar and content area layout.
- `[ ]` **Project Creation Flow:**
  - `[ ]` Implement a "New Project" button and modal.
  - `[ ]` Create the main project workspace UI with a stepper component for the 6 modules.
- `[ ]` **Build ONE AI Module Endpoint:**
  - `[ ]` Create the API route `/api/forge/idea-spark`.
  - `[ ]` This route must: 1) check user auth, 2) check if user has enough credits, 3) call the LLM, 4) **deduct credits from the user's account**, 5) save the JSON output to the `Project` model, 6) return the result.
- `[ ]` **Connect UI to Backend:** Wire up the "Idea Spark" step in the UI to call the API endpoint and display the results.
- `[ ]` **Implement Credit UI:** Display the user's credit balance in the header.
- `[ ]` **Build the remaining 5 module endpoints and connect them to the UI.**
- `[ ]` **Deploy to Vercel.**

### **Phase 2: Monetization & Mobile Shell**

**Goal:** Enable users to pay us and access the app on their phones.

- `[ ]` **Integrate Stripe:**
  - `[ ]` Set up Stripe products for the "Forge" and "Accelerator" plans.
  - `[ ]` Create API endpoints to handle Stripe webhooks for subscription updates.
  - `[ ]` Build a "Billing" or "Settings" page where users can manage their subscription.
- `[ ]` **Implement Credit Top-Ups:** Add Stripe products for one-time credit pack purchases.
- `[ ]` **Build React Native (Expo) Shell:**
  - `[ ]` Create a new Expo project.
  - `[ ]` The main screen will be a `WebView` component pointing to our production Next.js app URL.
  - `[ ]` Implement native login screens that handle authentication and then pass the session to the WebView.

### **Phase 3: Expansion & Polish**

**Goal:** Enhance the product with "nice-to-have" features that improve retention and user value.

- `[ ]` **Build Partner Marketplace:** A UI section with our affiliate links.
- `[ ]` **Implement Project Management:** Allow users to delete, rename, and view a list of all their projects.
- `[ ]` **Add "Export to PDF/DocX"** functionality for the final business plan.
- `[ ]` **Implement Analytics:** Integrate Vercel Analytics and a product analytics tool like PostHog.

Your task begins now with **Phase 1**. Focus on building a solid, functional core. Let's build the future of entrepreneurship.
