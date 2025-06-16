"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Heart, Sparkles, Star } from "lucide-react"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
}

export function PricingModal({ isOpen, onClose, onUpgrade }: PricingModalProps) {
  const freeFeatures = ["Basic chat support", "Up to 10 journal entries", "Basic mood tracking", "Local data storage"]

  const premiumFeatures = [
    "Unlimited journal entries",
    "Advanced mood analytics",
    "Export your data (PDF, JSON)",
    "Priority support",
    "Custom journal templates",
    "Mood trend visualizations",
    "Cloud backup & sync",
    "Advanced search & filtering",
    "Personalized insights",
    "Crisis resource integration",
    "Meditation timer",
    "Breathing exercises",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center">
            <DialogTitle className="text-2xl mb-2">Choose Your Wellness Plan</DialogTitle>
            <DialogDescription className="text-base">
              Start free and upgrade when you're ready for more features
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Free Plan */}
          <Card className="relative border-2 border-gray-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Free Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold mt-4">
                $0<span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-yellow-400 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 px-4 py-1">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-4 relative">
                <Crown className="h-8 w-8 text-white" />
                <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <CardTitle className="text-xl">Premium Plan</CardTitle>
              <CardDescription>Unlock your full wellness potential</CardDescription>
              <div className="text-3xl font-bold mt-4">
                $9.99<span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <p className="text-xs text-gray-500">Cancel anytime</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={onUpgrade}
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-center mb-4">Why Choose Premium?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium mb-2">Unlimited Support</h4>
              <p className="text-gray-600">No limits on journal entries or conversations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium mb-2">Advanced Analytics</h4>
              <p className="text-gray-600">Track patterns and insights in your wellness journey</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium mb-2">Premium Experience</h4>
              <p className="text-gray-600">Priority support and exclusive features</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">30-day money-back guarantee • Cancel anytime • Secure payment</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
