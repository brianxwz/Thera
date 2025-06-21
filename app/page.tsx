"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InteractiveTutorial } from "@/components/interactive-tutorial"
import { AuthModal } from "@/components/auth-modal"
import { PricingModal } from "@/components/pricing-modal" // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  Heart,
  AlertCircle,
  Sparkles,
  MessageCircle,
  BookOpen,
  TrendingUp,
  //Play, // TODO: Uncomment this when we have a tutorial
} from "lucide-react"

export default function HomePage() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false) // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("wellness-onboarding-completed")
    if (!hasCompletedOnboarding) {
      // TODO: Uncomment this when we have a tutorial
      //setShowTutorial(true)
    }
  }, [])

  useEffect(() => {
    const handleGetStarted = () => {
      // TODO: Uncomment this when we have a tutorial
      //setShowTutorial(true)
    }

    window.addEventListener("get-started", handleGetStarted)
    return () => window.removeEventListener("get-started", handleGetStarted)
  }, [])

  const handleTutorialComplete = () => {
    setShowTutorial(false)
    localStorage.setItem("wellness-onboarding-completed", "true")
  }

  const handleUpgrade = () => { // eslint-disable-line @typescript-eslint/no-unused-vars
    setShowPricingModal(false)
    // In a real app, this would handle the payment flow
  }

  return (
    <>
      {/* Main Content */}
      <main>
        <div className="container mx-auto p-4 max-w-7xl">
          <Card className="min-h-[calc(100vh-8rem)] shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden dark:bg-gray-800/90 dark:border-gray-700">
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Hero Section */}
              <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white p-12 text-center">
                <div className="max-w-4xl mx-auto">
                  <div className="relative inline-block mb-8">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Heart className="h-12 w-12 text-white animate-pulse" aria-hidden="true" />
                    </div>
                    <Sparkles className="h-8 w-8 text-yellow-300 absolute -top-2 -right-2 animate-bounce" aria-hidden="true" />
                  </div>
                  <h1 className="text-5xl font-bold mb-6">Your Personal Wellness Companion</h1>
                  <p className="text-xl text-purple-100 mb-8 leading-relaxed max-w-2xl mx-auto">
                    A safe, judgment-free space where AI meets compassion. Get emotional support, track your wellness journey,
                    and build healthier mental habits. All in one place.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => window.location.href = '/chat'}
                      size="lg"
                      className="tutorial-start-journey bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                    >
                      Start Your Journey
                      <Heart className="h-5 w-5 ml-2" aria-hidden="true" />
                    </Button>
                    {/* TODO: Uncomment this when we have a tutorial
                    <Button
                      onClick={() => setShowTutorial(true)}
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white backdrop-blur-sm px-8 py-4 text-lg font-semibold hover:scale-105"
                    >
                      Take the Tour
                      <Play className="h-5 w-5 ml-2" />
                    </Button> */}
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="bg-white py-16 dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-8">
                  <header className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 dark:text-white">
                      Everything you need for mental wellness
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                      Combining AI technology with evidence-based wellness practices to support your mental health journey.
                    </p>
                  </header>

                  <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <article className="p-8 text-center hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200 dark:bg-gray-700 dark:hover:border-purple-400">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                        <MessageCircle className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">AI Chat Support</h3>
                      <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                        Get 24/7 emotional support from a compassionate AI companion that listens without judgment and helps you
                        process your thoughts and feelings.
                      </p>
                    </article>

                    <article className="p-8 text-center hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200 dark:bg-gray-700 dark:hover:border-purple-400">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                        <BookOpen className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Smart Journaling</h3>
                      <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                        Automatically capture insights from your conversations or write manual entries. Track patterns, moods,
                        and growth over time.
                      </p>
                    </article>

                    <article className="p-8 text-center hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200 dark:bg-gray-700 dark:hover:border-purple-400">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                        <TrendingUp className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Wellness Insights</h3>
                      <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                        Understand your emotional patterns with intelligent analytics. Identify triggers, track progress, and
                        celebrate your growth.
                      </p>
                    </article>
                  </div>

                  {/* How It Works */}
                  <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-12 mb-16 dark:from-gray-700 dark:to-gray-600">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-12 dark:text-white">How it works</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                          1
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-3 dark:text-white">Share Your Thoughts</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Express your feelings, concerns, or celebrations in a safe, private space.
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                          2
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-3 dark:text-white">Get Support</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Receive empathetic responses, validation, and gentle guidance from your AI companion.
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                          3
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-3 dark:text-white">Track Progress</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Watch your wellness journey unfold through automatic journaling and insights.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Benefits */}
                  <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">
                        Why choose Liora Journal?
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">Available 24/7</h4>
                            <p className="text-gray-600 dark:text-gray-300">Get support whenever you need it, day or night.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">Completely Private</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              Conversations are safely encrypted and synced across devices.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">No Judgment</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              Express yourself freely in a safe, supportive environment.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1 dark:text-white">Evidence-Based</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              Built on proven mental health and wellness practices.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <aside className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 text-center dark:from-gray-700 dark:to-gray-600">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6">
                        <Heart className="h-16 w-16 text-white animate-pulse" aria-hidden="true" />
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Start feeling better today</h4>
                      <p className="text-gray-600 mb-6 dark:text-gray-300">
                        Join others who have found support and growth through our wellness companion.
                      </p>
                      <Button
                        onClick={() => window.location.href = '/chat'}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Begin Your Journey
                      </Button>
                    </aside>
                  </section>
                </div>
              </section>

              {/* Important Notice */}
              <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 py-12 dark:from-amber-900/50 dark:to-orange-900/50 dark:border-amber-800">
                <div className="max-w-4xl mx-auto px-8">
                  <div className="flex items-start gap-6">
                    <AlertCircle className="h-8 w-8 text-amber-600 mt-1 flex-shrink-0 dark:text-amber-400" aria-hidden="true" />
                    <div>
                      <h4 className="text-xl font-semibold text-amber-800 mb-3 dark:text-amber-200">Important Notice</h4>
                      <p className="text-amber-700 leading-relaxed mb-4 dark:text-amber-300">
                        This wellness companion provides emotional support and helps you process your thoughts and feelings.
                        It's designed to complement, not replace, professional mental health care.
                      </p>
                      <p className="text-amber-700 leading-relaxed dark:text-amber-300">
                        <strong>
                          If you're experiencing severe distress, thoughts of self-harm, or mental health crises, please seek
                          professional help immediately.
                        </strong>{" "}
                        Contact your healthcare provider, a mental health professional, or emergency services.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </div>
      </main>

      {/* Interactive Tutorial */}
      <InteractiveTutorial
        isActive={showTutorial}
        onComplete={handleTutorialComplete}
        onSectionChange={() => {}} // No longer needed since we have separate pages
        currentSection="home"
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/*<PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />*/}
    </>
  )
}
