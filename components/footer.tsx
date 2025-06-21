"use client"

import React from "react"
import { Heart, Shield, Lock, Users, Sparkles } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-10 lg:pl-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Liora Journal</h3>
                <p className="text-sm text-gray-300">Your Personal Wellness Companion</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              A safe, judgment-free space where AI meets compassion. Get emotional support, 
              track your wellness journey, and build healthier mental habits.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-purple-400" />
                AI Chat Support
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-3 w-3 text-purple-400" />
                Smart Journaling
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-3 w-3 text-purple-400" />
                Wellness Insights
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-purple-400" />
                Privacy First
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              {/*<li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>*/}
              {/*<li>
                <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>*/}
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Lock className="h-3 w-3" />
              <span>Your data is encrypted and secure</span>
            </div>
            <div className="text-sm text-gray-300">
              © {currentYear} Liora Journal. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 