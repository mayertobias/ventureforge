/* eslint-disable react/no-unescaped-entities */
import { Shield, Eye, Database, Globe, Lock, UserX, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: January 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Privacy Matters
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              At VentureForge, we believe your business ideas and strategies deserve the highest 
              level of privacy protection. This Privacy Policy explains how we collect, use, 
              protect, and handle your personal information and business data.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We&apos;ve built VentureForge with a zero-knowledge architecture, meaning we cannot 
              access your encrypted business data even if we wanted to.
            </p>
          </section>

          {/* Key Privacy Principles */}
          <section className="mb-12 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-600">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Privacy Principles
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Zero-Knowledge Encryption</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Your business data is encrypted with keys only you control. We cannot decrypt 
                  or access your business ideas, strategies, or financial information.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Minimization</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We collect only the minimum data necessary to provide our service and 
                  improve your experience.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">User Control</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  You decide what data to share, who can access it, and when to delete it. 
                  You have complete control over your information.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Transparency</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We clearly explain what data we collect, how we use it, and who we share 
                  it with (spoiler: we don&apos;t share your business data with anyone).
                </p>
              </div>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Information We Collect
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Account Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-300">
                  <li>Email address (for authentication and communication)</li>
                  <li>Name (from your Google OAuth profile)</li>
                  <li>Profile picture (from your Google OAuth profile, optional)</li>
                  <li>Account creation date and login history</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Business Data (Encrypted)
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Your business-related content is encrypted before storage and includes:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-300">
                  <li>Business ideas and concepts you generate</li>
                  <li>Market research and competitive analysis</li>
                  <li>Business models and strategic plans</li>
                  <li>Financial projections and models</li>
                  <li>Investor pitch materials</li>
                  <li>Go-to-market strategies</li>
                </ul>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✓ This data is encrypted with AES-256-GCM and can only be decrypted by you
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Usage Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  To improve our service, we collect:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-300">
                  <li>Feature usage patterns (which AI modules you use)</li>
                  <li>Credit usage and subscription information</li>
                  <li>Error logs and performance metrics</li>
                  <li>Device and browser information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Service Delivery
                </h3>
                <p>
                  We use your information to provide VentureForge's AI-powered business planning 
                  tools, process your requests, and deliver personalized business insights.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Account Management
                </h3>
                <p>
                  Your account information helps us authenticate you, manage your subscription, 
                  track credit usage, and provide customer support.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Service Improvement
                </h3>
                <p>
                  We analyze usage patterns and performance metrics to improve our AI models, 
                  optimize the user experience, and develop new features.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Communication
                </h3>
                <p>
                  We may send you service-related notifications, account updates, and important 
                  security information. Marketing communications are opt-in only.
                </p>
              </div>
            </div>
          </section>

          {/* Data Encryption and Security */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Encryption and Security
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Zero-Knowledge Architecture
                </h3>
                <p className="mb-2">
                  Your business data is protected by our zero-knowledge encryption system:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Each user has a unique 256-bit encryption key</li>
                  <li>Keys are managed through HashiCorp Vault Transit engine</li>
                  <li>Data is encrypted with AES-256-GCM before database storage</li>
                  <li>Only you can decrypt your data when authenticated</li>
                  <li>Our staff cannot access your encrypted business data</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Additional Security Measures
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and audit logging</li>
                  <li>Secure cloud infrastructure with enterprise-grade security</li>
                  <li>Regular security updates and patches</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Third-Party Services
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                VentureForge integrates with certain third-party services to provide our AI-powered 
                business planning tools. Here's how your data is handled:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    AI Model Providers (OpenAI, Google)
                  </h3>
                  <p className="mb-2">
                    We use AI models from OpenAI and Google to generate business insights. When you 
                    use our AI modules:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Your prompts are sent to AI providers for processing</li>
                    <li>Responses are received and then encrypted before storage</li>
                    <li>AI providers may temporarily cache requests for performance</li>
                    <li>Your data is subject to their privacy policies during processing</li>
                    <li>We do not allow AI providers to train on your data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Google OAuth
                  </h3>
                  <p>
                    We use Google OAuth for secure authentication. Google provides your basic 
                    profile information (name, email, profile picture) which we use to create 
                    your account.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Payment Processing
                  </h3>
                  <p>
                    Payment information is processed securely through Stripe. We do not store 
                    your payment details on our servers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Sharing and Disclosure
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-600">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  We Do Not Sell Your Data
                </h3>
                <p>
                  We do not sell, rent, or trade your personal information or business data to 
                  third parties for marketing purposes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Limited Disclosure Scenarios
                </h3>
                <p className="mb-2">
                  We may disclose your information only in these limited circumstances:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>With your consent:</strong> When you explicitly authorize us to share information</li>
                  <li><strong>Legal requirements:</strong> To comply with valid legal processes, court orders, or law enforcement requests</li>
                  <li><strong>Safety protection:</strong> To protect the safety of our users or the public</li>
                  <li><strong>Business transfers:</strong> In connection with a merger, sale, or acquisition (with continued privacy protections)</li>
                  <li><strong>Service providers:</strong> With trusted partners who help us operate the service (under strict confidentiality agreements)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  User-Controlled Support Access
                </h3>
                <p>
                  You can grant our support team temporary access to specific projects when you 
                  need help. This access is:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Only granted by you through explicit consent</li>
                  <li>Limited to specific projects and time periods</li>
                  <li>Revocable at any time</li>
                  <li>Fully audited and logged</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Retention and Deletion
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Active Accounts
                </h3>
                <p>
                  We retain your account information and encrypted business data for as long as 
                  your account remains active or as needed to provide our services.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Account Deletion
                </h3>
                <p className="mb-2">
                  When you delete your account:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Your encrypted business data is permanently deleted</li>
                  <li>Your encryption keys are destroyed</li>
                  <li>Account information is removed from our systems</li>
                  <li>We retain minimal data for legal compliance (e.g., payment records)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Backup and Recovery
                </h3>
                <p>
                  We maintain encrypted backups for 30 days for disaster recovery purposes. 
                  These backups are also encrypted and are permanently deleted after 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <UserX className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Privacy Rights
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                You have the following rights regarding your personal information:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Access</h3>
                  <p className="text-sm">Request a copy of your personal information</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Correction</h3>
                  <p className="text-sm">Update or correct inaccurate information</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deletion</h3>
                  <p className="text-sm">Request deletion of your personal information</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Portability</h3>
                  <p className="text-sm">Export your data in a machine-readable format</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Objection</h3>
                  <p className="text-sm">Object to certain processing activities</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Withdrawal</h3>
                  <p className="text-sm">Withdraw consent for data processing</p>
                </div>
              </div>
              
              <p className="text-sm">
                To exercise these rights, contact us at privacy@ventureforge.ai. We will respond 
                within 30 days of receiving your request.
              </p>
            </div>
          </section>

          {/* International Data Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              International Data Transfers
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                VentureForge operates globally and may transfer your data to countries outside 
                your jurisdiction. When we do, we ensure appropriate safeguards are in place to 
                protect your privacy.
              </p>
              
              <p>
                For users in the European Union, we comply with GDPR requirements and use 
                appropriate transfer mechanisms such as Standard Contractual Clauses.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Children's Privacy
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                VentureForge is not intended for children under 13 years of age. We do not 
                knowingly collect personal information from children under 13. If we become 
                aware that we have collected personal information from a child under 13, we 
                will delete such information immediately.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Changes to This Privacy Policy
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                We may update this Privacy Policy from time to time. When we make changes, we will:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Post the updated policy on this page</li>
                <li>Update the "Last updated" date</li>
                <li>Notify you of significant changes via email</li>
                <li>Provide 30 days notice for material changes</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Contact Us
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, 
                please contact us:
              </p>
              <ul className="space-y-1">
                <li><strong>Email:</strong> privacy@ventureforge.ai</li>
                <li><strong>Address:</strong> VentureForge Inc., [Address to be provided]</li>
                <li><strong>Data Protection Officer:</strong> dpo@ventureforge.ai</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-8">
          <div className="space-x-4">
            <a
              href="/terms"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Terms of Service
            </a>
            <a
              href="/trust"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Trust Center
            </a>
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}