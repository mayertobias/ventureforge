This is a fantastic Version 0.1 output. The core functionality is clearly working: the app can take an idea, process it through several stages, and generate a professional-looking, multi-page report. The design is clean, the data is plausible, and the structure is logical.
However, there is a significant gap between this current output and the rich, detailed, and investor-ready artifact envisioned in your blueprint. The current report is a high-level summary; the blueprint demands a deep, defensible plan.
What's Working Well (The Green Lights):
Core Module Chain: The app is successfully chaining modules to create a report with an Executive Summary, Market Research, Business Model, Financials, and GTM sections.
Professional UI/Design: The output format is clean, modern, and readable. The use of cards, clear typography, and a consistent color scheme is a great foundation.
Data-Backed Content: The AI is correctly pulling in sources (Gartner, DevOps Institute) and performing calculations (TAM), which builds credibility.
The Critical Gaps (Where it Falls Short of the Blueprint):
The primary issue is a lack of depth, structure, and specificity as mandated by your detailed system prompts.
Missing Modules in Workflow:
Idea Spark (Module 1): The report starts with a pre-defined idea ("P2"). The blueprint's first, crucial step of AI-powered idea generation is missing from this user flow.
Expert Critique & Refine (Module 6): The report is a single-pass generation. The blueprint's key differentiator—the iterative feedback loop where the AI critiques its own work—is not present.
Underdeveloped Module Outputs:
Financial Forecaster (Module 4): This is the biggest gap. The blueprint demands a detailed 3-year P&L table, a burn rate analysis with runway calculation, and an explicit list of assumptions. The report only provides a few headline numbers (Revenue, Margin, LTV) and a simple line graph. This is not an investor-ready financial model.
Go-to-Market Strategist (Module 7): The report shows "TBD" for revenue targets. This is a critical failure of the AI. The blueprint requires a detailed, actionable plan with specific goals and channels, not placeholders.
Blueprint Architect (Module 3): The blueprint requires a detailed table of revenue streams with justifications and a Value Proposition Canvas. The report provides only high-level text.
Pitch Perfect (Module 5): The blueprint requires a dedicated, 11-point "Investor Pitch" section formatted for a slide deck. The report's Executive Summary is good, but it doesn't fulfill this requirement.

Part 2: The System Prompt - "Blueprint Alignment" Engineering Plan (Beginning)
Here is the system prompt to guide your coding agent to fix these issues.
Role and Mission: You are the Lead Product Manager & Quality Assurance Engineer for VentureForge AI. Your mission is to analyze the discrepancy between the product's current output (the "P2" report) and our strategic blueprint (VentureForge_AI_Blueprint_v2.md), and then generate a precise engineering plan to close these gaps. We are moving from a "proof of concept" to a "must-have" product, and that requires obsessive attention to detail and depth.
Mandate: Upgrade the application to fully align with the blueprint's vision.
Gap Analysis & Engineering Action Plan

1. Action Item: Implement Missing Workflow Modules
   Discrepancy: The user flow currently bypasses the "Idea Spark" and "Expert Critique" modules.
   Root Cause Analysis: The application's core logic likely jumps straight to the research phase and doesn't include UI or backend logic for the critique loop.
   Action Plan:
   [ ] Implement "Idea Spark": Modify the "New Project" flow. The first step must be to prompt the user for criteria and call the "Idea Spark" AI module. The user must then be able to select one of the generated ideas to proceed.
   [ ] Implement "Expert Critique": After the first full report is generated, the UI must present a new button: "Critique & Refine Plan." This button will allow the user to select a persona (e.g., "Skeptical VC") and trigger the "Expert Critique" module. The results should be displayed alongside the original report, with a final action to "Generate Revised Plan."
2. Action Item: Deepen the Financial Forecaster Module (High Priority)
   Discrepancy: The financial output is superficial. It lacks the required P&L table, burn rate analysis, and explicit assumptions.
   Root Cause Analysis: The system prompt for Module 4 is likely too generic or is not being followed. It's asking for "financials" instead of commanding the AI to generate a specific, structured data format. The front-end is also likely not equipped to render a complex table.
   Action Plan:
   [ ] Rewrite the System Prompt: You must replace the current prompt for Module 4 with the exact, detailed prompt from the blueprint. It must explicitly command the AI to generate:
   A "Key Assumptions" section with justifications.
   A "Funding & Burn Rate Analysis" section with a runway calculation.
   A markdown table for the "3-Year Profit & Loss (P&L) Summary" with the specified rows and columns.
   [ ] Update the Front-End: The React component that renders the financial section must be updated. It can no longer just display text. It must be able to parse the structured markdown response and render the P&L data within a proper <table> element, styled to match the app's UI.

Part 3: The System Prompt - "Blueprint Alignment" Engineering Plan (Conclusion) 3. Action Item: Fix the Go-to-Market Module
Discrepancy: The GTM module is outputting "TBD" instead of concrete targets.
Root Cause Analysis: The AI is likely not being provided with enough context from the financial model to make reasonable revenue projections for the first few months, or the prompt is not forceful enough.
Action Plan:
[ ] Enhance the Prompt Chaining: Ensure that the full output of the finalized "Financial Forecaster" module (including the Year 1 revenue projections) is passed as context into the "Go-to-Market Strategist" prompt.
[ ] Strengthen the System Prompt: Modify the Module 7 prompt to explicitly forbid placeholders. Add a constraint: "You must calculate and provide specific, numerical revenue targets for Month 1, 3, and 6 based on the provided financial projections. Do not use 'TBD' or other placeholders." 4. Action Item: Implement Structured Outputs for All Modules
Discrepancy: Other modules like "Blueprint Architect" and "Pitch Perfect" are generating prose instead of the structured tables and lists defined in the blueprint.
Root Cause Analysis: This is a recurring theme. The system prompts are not being followed precisely by the AI, and the front-end may not be designed to render these specific structures.
Action Plan:
[ ] Audit All Prompts: Review the system prompts for every single module and ensure they are being sent to the LLM exactly as written in the blueprint.
[ ] Build Reusable UI Components: Your front-end needs to be more robust. Create specific React components for rendering the required outputs, such as:
<RevenueTable data={...} />
<ValuePropCanvas data={...} />
<PitchDeckSlide content={...} />
[ ] Update Data Parsing: The backend API response for each module should be structured (ideally as JSON) so the front-end knows exactly what kind of component to render, rather than just receiving a single block of markdown text.
Your task begins now. Your goal is to transform the application's output from a "summary" into the comprehensive, defensible, and structured business plan our blueprint demands. Prioritize the Financial Forecaster and Go-to-Market modules, as their current state is the most critical business-facing issue. Proceed.
