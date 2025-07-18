/* eslint-disable react/no-unescaped-entities */
import { FileText, Shield, User, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
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
              Welcome to VentureForge
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These Terms of Service ("Terms") govern your use of VentureForge AI ("Service"), 
              operated by VentureForge Inc. ("we," "us," or "our"). By accessing or using our Service, 
              you agree to be bound by these Terms.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          {/* Intellectual Property - Critical Section */}
          <section className="mb-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-600">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Intellectual Property Rights
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="font-semibold text-lg text-gray-900 dark:text-white">
                You own 100% of your generated content and intellectual property.
              </p>
              
              <p>
                All business ideas, research, financial projections, business plans, pitch decks, 
                go-to-market strategies, and any other content generated through VentureForge 
                ("Generated Content") are and remain your exclusive intellectual property.
              </p>
              
              <p>
                VentureForge makes no claim to ownership of your Generated Content. We do not 
                acquire any rights, title, or interest in your business ideas, strategies, or 
                any derivative works created from your use of our Service.
              </p>
              
              <p>
                You retain all rights to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use, modify, and distribute your Generated Content</li>
                <li>Create derivative works based on your Generated Content</li>
                <li>Commercialize your business ideas and strategies</li>
                <li>Protect your intellectual property through patents, trademarks, or copyrights</li>
                <li>License your Generated Content to third parties</li>
              </ul>
              
              <p>
                <strong>No License to VentureForge:</strong> You do not grant VentureForge any 
                license or right to use your Generated Content for any purpose other than 
                providing the Service to you.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Accounts
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                To access certain features of the Service, you must create an account. You are 
                responsible for maintaining the confidentiality of your account credentials and 
                for all activities that occur under your account.
              </p>
              
              <p>
                You agree to provide accurate, current, and complete information during registration 
                and to update such information to keep it accurate, current, and complete.
              </p>
              
              <p>
                You are responsible for safeguarding your account and agree to notify us immediately 
                of any unauthorized use of your account or any other breach of security.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Service Description
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                VentureForge is an AI-powered business planning platform that helps entrepreneurs 
                develop comprehensive business plans through a structured process including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Business idea generation and refinement</li>
                <li>Market research and competitive analysis</li>
                <li>Business model and strategy development</li>
                <li>Financial projections and modeling</li>
                <li>Investor pitch creation</li>
                <li>Go-to-market strategy development</li>
              </ul>
              
              <p>
                The Service uses artificial intelligence models from third-party providers 
                (including OpenAI and Google) to generate business insights and recommendations.
              </p>
            </div>
          </section>

          {/* Privacy and Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy and Data Security
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Your privacy is paramount to us. We implement zero-knowledge encryption to protect 
                your business data, ensuring that only you can access your Generated Content.
              </p>
              
              <p>
                Key privacy protections include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>AES-256-GCM encryption of all user project data</li>
                <li>User-specific encryption keys managed through HashiCorp Vault</li>
                <li>Zero-knowledge architecture preventing staff access to your data</li>
                <li>Secure data transmission and storage</li>
              </ul>
              
              <p>
                For complete details on how we handle your data, please review our 
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</a>.
              </p>
            </div>
          </section>

          {/* Credit System */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Credit System and Billing
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                VentureForge operates on a credit-based system. Each AI module requires a specific 
                number of credits to use. Credits are deducted upon successful completion of each module.
              </p>
              
              <p>
                New users receive 100 credits upon registration. Additional credits can be purchased 
                through our subscription plans or credit top-ups.
              </p>
              
              <p>
                Credits are non-refundable and do not expire. However, credits are tied to your account 
                and cannot be transferred to other users.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Acceptable Use Policy
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                You agree to use the Service only for lawful purposes and in accordance with these Terms. 
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Generate content that is harmful, abusive, or violates others' rights</li>
                <li>Attempt to circumvent our security measures or access restrictions</li>
                <li>Use the Service to develop competing AI business planning tools</li>
                <li>Share your account credentials with unauthorized parties</li>
                <li>Interfere with or disrupt the Service or servers</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Disclaimers and Limitations
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>AI-Generated Content:</strong> The Service uses AI to generate business insights 
                and recommendations. While we strive for accuracy, AI-generated content may contain 
                errors, inaccuracies, or be incomplete. You should verify all information before making 
                business decisions.
              </p>
              
              <p>
                <strong>No Business Advice:</strong> The Service provides tools and templates but does 
                not constitute professional business, legal, or financial advice. Consult with qualified 
                professionals before making important business decisions.
              </p>
              
              <p>
                <strong>No Guarantees:</strong> We do not guarantee the success of any business ideas 
                or strategies generated through the Service. Business success depends on many factors 
                beyond our control.
              </p>
              
              <p>
                <strong>Service Availability:</strong> We strive to maintain high service availability 
                but cannot guarantee uninterrupted access. The Service may be temporarily unavailable 
                due to maintenance, updates, or technical issues.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Account Termination
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                You may terminate your account at any time by contacting us or using the account 
                deletion feature in your settings.
              </p>
              
              <p>
                We may terminate or suspend your account if you violate these Terms, engage in 
                fraudulent activity, or for other legitimate business reasons.
              </p>
              
              <p>
                Upon termination, your right to use the Service ceases immediately. We will permanently 
                delete your account data according to our data retention policies, typically within 
                30 days of termination.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Changes to Terms
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                We reserve the right to modify these Terms at any time. When we make changes, we will 
                post the updated Terms on this page and update the "Last updated" date.
              </p>
              
              <p>
                Your continued use of the Service after changes to these Terms constitutes acceptance 
                of the new Terms. If you do not agree with the changes, you should discontinue use 
                of the Service.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="space-y-1">
                <li><strong>Email:</strong> legal@ventureforge.ai</li>
                <li><strong>Address:</strong> VentureForge Inc., [Address to be provided]</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-8">
          <div className="space-x-4">
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Privacy Policy
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