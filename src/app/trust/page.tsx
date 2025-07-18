/* eslint-disable react/no-unescaped-entities */
import { Shield, Lock, Key, Eye, UserCheck, FileText, CheckCircle } from "lucide-react";

export default function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trust Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your business ideas deserve the highest level of protection. Learn how VentureForge 
            safeguards your intellectual property with zero-knowledge encryption.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Lock className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Zero-Knowledge Encryption
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your business ideas, research, and financial projections are encrypted with AES-256-GCM 
              before being stored. Only you can decrypt and view your sensitive data.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Key className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                User-Specific Keys
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Each user gets a unique encryption key managed through HashiCorp Vault. 
              Your key is tied to your authentication and cannot be accessed by others.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Eye className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Private by Design
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Our staff cannot read your business ideas, even with database access. 
              Your intellectual property remains completely private to you.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How Your Data is Protected
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Unique Key Generation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  When you create your first project, VentureForge generates a unique encryption key 
                  specifically for your account using HashiCorp Vault's Transit engine.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <span className="text-green-600 dark:text-green-300 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Real-Time Encryption
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every time you generate business ideas, research, or financial projections, 
                  the data is encrypted with AES-256-GCM before being stored in our database.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <span className="text-purple-600 dark:text-purple-300 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Secure Access Control
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Only when you&apos;re authenticated and viewing your projects does VentureForge 
                  decrypt your data in memory. It's never stored in plaintext.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Technical Implementation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Encryption Standards
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  AES-256-GCM authenticated encryption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  HashiCorp Vault Transit engine
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Unique 256-bit keys per user
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Secure random IV generation
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Security Features
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Zero-knowledge architecture
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  End-to-end data protection
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Authentication-based decryption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Audit logging and monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* IP Ownership */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Intellectual Property
            </h2>
          </div>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p className="text-lg">
              <strong className="text-gray-900 dark:text-white">You own 100% of your generated content.</strong> 
              Every business idea, research insight, financial projection, and strategy created through 
              VentureForge belongs entirely to you.
            </p>
            
            <p>
              VentureForge serves as a tool to help you develop and refine your business concepts, 
              but we make no claim to ownership of your intellectual property. Whether you&apos;re 
              building the next unicorn startup or exploring a side business, your ideas remain yours.
            </p>
            
            <p>
              Our zero-knowledge encryption ensures that your business strategies and competitive 
              advantages are protected not just legally, but technically. Even our own team cannot 
              access your encrypted business data.
            </p>
          </div>
        </div>

        {/* Support Model */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-16">
          <div className="flex items-center mb-6">
            <UserCheck className="w-8 h-8 mr-3" />
            <h2 className="text-3xl font-bold">
              User-Controlled Support Access
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg">
              Need help with your projects? You're in complete control of what our support team can see.
            </p>
            
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">How Support Access Works:</h3>
              <ul className="space-y-2">
                <li>• You create a support ticket for specific assistance</li>
                <li>• You explicitly grant access to specific projects via ticket ID</li>
                <li>• Support access automatically expires after resolution</li>
                <li>• You can revoke access at any time</li>
                <li>• Full audit trail of all access grants</li>
              </ul>
            </div>
            
            <p className="text-sm opacity-90">
              <strong>Coming Soon:</strong> Advanced support controls will be available in your account settings, 
              allowing you to manage exactly which projects support can access and for how long.
            </p>
          </div>
        </div>

        {/* Transparency */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Transparency & Limitations
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                What We Protect
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Your business ideas and concepts</li>
                <li>• Market research and competitive analysis</li>
                <li>• Financial projections and models</li>
                <li>• Business strategies and plans</li>
                <li>• Pitch decks and investor materials</li>
                <li>• Go-to-market strategies</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Important Considerations
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• AI providers (OpenAI, Google) process your inputs temporarily</li>
                <li>• We retain encrypted backups for 30 days for disaster recovery</li>
                <li>• Account deletion permanently removes all your data</li>
                <li>• Export your data anytime before deletion</li>
                <li>• Legal compliance may require disclosure under court order</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Build with Confidence?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your business ideas are secure. Start building your next venture with VentureForge.
          </p>
          <div className="space-x-4">
            <a
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </a>
            <a
              href="/terms"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Read Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}