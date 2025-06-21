"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, Users, Calendar } from "lucide-react"

export default function PrivacyPage() {
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString())
  }, [])

  return (
    <main>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Privacy Policy</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Last updated: {currentDate || "Loading..."}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
            At Liora Journal, we believe your privacy is fundamental to your wellness journey. 
            This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>

        <div className="space-y-6">
          {/* Information We Collect */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700">
            <CardHeader className="pt-3">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-3">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Account Information</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>• Email address (for account creation and login)</li>
                  <li>• Name (optional, for personalization)</li>
                  <li>• Account preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Journal Content</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>• Your journal entries and reflections</li>
                  <li>• Mood tracking data</li>
                  <li>• Tags and categories you create</li>
                  <li>• Chat conversations with our AI companion</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Usage Data</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>• How you interact with our app</li>
                  <li>• Features you use most frequently</li>
                  <li>• Technical information (browser type, device info)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700">
            <CardHeader className="pt-3">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">To Provide Our Services</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                    <li>• Store and display your journal entries</li>
                    <li>• Generate AI responses in chat</li>
                    <li>• Track your mood and wellness patterns</li>
                    <li>• Provide personalized insights</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">To Improve Our Service</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                    <li>• Analyze usage patterns (anonymized)</li>
                    <li>• Fix bugs and technical issues</li>
                    <li>• Develop new features</li>
                    <li>• Enhance AI capabilities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700">
            <CardHeader className="pt-3">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                How We Protect Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Encryption</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All data is encrypted in transit and at rest using industry-standard encryption protocols.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Access Control</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Only authorized personnel have access to your data, and all access is logged and monitored.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Regular Security Audits</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We conduct regular security assessments and updates to maintain the highest security standards.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Data Minimization</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We only collect the data necessary to provide our services and improve your experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700">
            <CardHeader className="pt-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Data Sharing and Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share data only in these limited circumstances:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>• <strong>Service Providers:</strong> We work with trusted partners who help us provide our services (hosting, analytics, etc.)</li>
                <li>• <strong>Legal Requirements:</strong> If required by law or to protect our rights and safety</li>
                <li>• <strong>With Your Consent:</strong> Only when you explicitly give us permission</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700">
            <CardHeader className="pt-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Access and Control</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                    <li>• View and download your data</li>
                    <li>• Update your account information</li>
                    <li>• Delete your account and data</li>
                    <li>• Opt out of certain data collection</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Data Retention</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                    <li>• Your data is kept as long as you have an account</li>
                    <li>• Deleted data is permanently removed</li>
                    <li>• You can request immediate deletion</li>
                    <li>• Backup data is also deleted</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
} 