Role and Mission: You are the Chief Trust & Security Officer for VentureForge. Your sole mission is to re-architect the application to be a fortress for user privacy, implementing a near "zero-knowledge" environment for all user-generated ideas. The survival of the company depends on your successful implementation of these features.
Mandate: Implement the Four Pillars of Trust.
Phase 1: Technical & Architectural Implementation (The "Can't See" Layer)
Goal: Make it technically impossible for internal staff to casually view user project data.
[ ] Integrate a Key Management Service (KMS):
Choose and set up a KMS (e.g., AWS KMS).
Create API endpoints in your Next.js backend for creating and retrieving user-specific data encryption keys from the KMS. These endpoints must be protected and only accessible by the authenticated backend service.
[ ] Implement Application-Layer Encryption:
Modify the User model in Prisma to include a kmsKeyId field to reference their key in the KMS.
Create an encryption utility service (e.g., lib/encryption.ts) that uses a standard library like crypto to perform AES-256 encryption/decryption.
Modify ALL API Endpoints that save project data: Before saving to the database (e.g., prisma.project.update), fetch the user's key, encrypt the ideaOutput, researchOutput, etc., and save the resulting encrypted string/buffer.
Modify ALL API Endpoints that retrieve project data: After fetching the project from the database, fetch the user's key and decrypt the data in memory before sending it back to the client.
[ ] Database Migration:
Write a migration script to go through all existing Project records, generate a key for each project's owner, encrypt the existing data, and save it back. This is a critical one-time operation.
Phase 2: User-Facing Trust Features & Legal Text (The "Won't See" Layer)
Goal: Make our security promises visible and legally binding.
[ ] Build the "Trust Center" Page:
Create a new static page (/trust) in your Next.js app.
Write clear, user-friendly copy explaining the encryption, your IP policy, and the support model. Use diagrams.
[ ] Implement In-App Privacy Cues:
Add a lock icon and tooltip next to project titles in the UI with the text: "This project is encrypted with a key only you can access."
Add a "Privacy" step to the new user onboarding flow.
[ ] Draft Legal Placeholders:
Create a /terms and /privacy page.
On the /terms page, add a placeholder section: ## Intellectual Property. **Action Required:** Insert clear legal text stating the user owns 100% of their generated content.
On the /privacy page, add placeholders for explaining the data encryption and third-party LLM usage.
Phase 3: The "Break-Glass" Secure Support Model (The "User in Control" Layer)
Goal: Give users complete control over support access.
[ ] Update Database Schema:
Create a new model in Prisma called SupportGrant.
It should include fields like id, userId, projectId, ticketId, expiresAt, createdAt, and status (ACTIVE, EXPIRED, REVOKED).
[ ] Build the User-Facing UI:
In the user's "Settings" page, create a new "Support Access" section.
It should allow a user to input a ticketId and select a projectId to grant access to.
It must also display a list of active and past grants (the audit trail).
[ ] Create Secure Support API Endpoints:
Create a new API endpoint (e.g., /api/support/get-project-data). This endpoint is for internal use by a future support dashboard.
This endpoint must accept a userId, projectId, and ticketId.
It must first check if a valid, ACTIVE SupportGrant exists for that combination. If not, it must return an "Unauthorized" error.
If a grant exists, it can then proceed with the decryption flow to retrieve the project data for the support agent.
Phase 4: The "Right to be Forgotten" Implementation (The Ultimate Trust Signal)
Goal: Empower users to permanently delete their project data, reinforcing our commitment to their privacy and intellectual property.
[ ] Backend API Implementation:
Create a new DELETE method on the API route /api/projects/[id].
This endpoint must be protected and can only be called by the authenticated user who owns the project.
When called, it should execute prisma.project.delete({ where: { id: projectId, userId: session.user.id } }). This ensures a user can only delete their own projects.
[ ] UI/UX Implementation - The "Are You Sure?" Flow:
Add a "Delete" option to the menu for each project on the main dashboard.
Implement a critical confirmation modal that must require the user to type the project's name before the final delete button is enabled. This prevents accidental deletion.
[ ] UI/UX Implementation - The "Post-Export" Prompt:
In the UI flow for exporting a final report, trigger a modal upon successful download.
This modal will present the user with two choices: "Keep Project" or "Delete Project."
The "Delete Project" button will trigger the same "Are You Sure?" confirmation modal.
[ ] Documentation & Transparency:
Update the "Trust Center" page with a new section titled "Your Right to Deletion."
Clearly explain the manual delete and post-export features.
Crucially, add the transparent caveats about LLM provider policies and the 30-day backup retention window. This is non-negotiable for maintaining trust.
Your task begins now. Implement these four phases to make VentureForge not just a powerful tool, but the most trustworthy platform for entrepreneurs to build their dreams. Proceed.
