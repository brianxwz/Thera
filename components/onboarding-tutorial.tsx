"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Heart,
  MessageCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  X,
  Play,
  Users,
  Shield,
  Zap,
} from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: any
  content: React.ReactNode
  targetSection?: string
}

interface OnboardingTutorialProps {
  isOpen: boolean
  onClose: () => void
  onSectionChange: (section: string) => void
  currentSection: string
}

export function OnboardingTutorial({ isOpen, onClose, onSectionChange, currentSection }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to Your Wellness Companion! 🌟",
      description: "Let's take a quick tour to help you get the most out of your wellness journey.",
      icon: Heart,
      content: (
        <div className="text-center py-6">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="h-12 w-12 text-white animate-pulse" />
            </div>
            <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">You're in a safe space</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            This is your personal wellness companion - a judgment-free zone where you can share your thoughts, process
            your feelings, and track your emotional journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <Shield className="h-4 w-4" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <Users className="h-4 w-4" />
              <span>Always Available</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <Zap className="h-4 w-4" />
              <span>AI-Powered Support</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "navigation",
      title: "Easy Navigation",
      description: "Your wellness tools are organized in the sidebar for easy access.",
      icon: MessageCircle,
      content: (
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Home</h4>
                <p className="text-sm text-gray-600">Your wellness dashboard and overview</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Chat Support</h4>
                <p className="text-sm text-gray-600">Talk with your AI wellness companion</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">My Journal</h4>
                <p className="text-sm text-gray-600">Automatically generated from your conversations</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "chat-demo",
      title: "Start a Conversation",
      description: "Let's explore the chat feature - the heart of your wellness companion.",
      icon: MessageCircle,
      targetSection: "chat",
      content: (
        <div className="py-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">How Chat Support Works:</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Select your current mood</p>
                  <p className="text-gray-600">Choose from the mood buttons to help contextualize your conversation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Share what's on your mind</p>
                  <p className="text-gray-600">Type anything - your thoughts, feelings, concerns, or celebrations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Receive supportive responses</p>
                  <p className="text-gray-600">Get validation, perspective, and gentle guidance</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Smart Features</span>
            </div>
            <p className="text-sm text-blue-600">
              Your companion remembers previous conversations and can reference your journal entries to provide more
              personalized support over time.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "mood-tracking",
      title: "Mood Tracking Made Simple",
      description: "Track your emotional state with easy-to-use mood buttons.",
      icon: Heart,
      targetSection: "chat",
      content: (
        <div className="py-4">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Choose Your Current Mood:</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "😊", label: "Great", color: "bg-green-100 text-green-700" },
                { emoji: "🙂", label: "Good", color: "bg-blue-100 text-blue-700" },
                { emoji: "😐", label: "Okay", color: "bg-yellow-100 text-yellow-700" },
                { emoji: "😔", label: "Low", color: "bg-purple-100 text-purple-700" },
                { emoji: "😰", label: "Anxious", color: "bg-orange-100 text-orange-700" },
                { emoji: "🙏", label: "Grateful", color: "bg-pink-100 text-pink-700" },
              ].map((mood) => (
                <div
                  key={mood.label}
                  className={`h-16 flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 ${mood.color}`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <h5 className="font-medium text-amber-800 mb-2">Why track your mood?</h5>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Helps your companion provide more relevant support</li>
              <li>• Creates patterns you can review in your journal</li>
              <li>• Builds self-awareness over time</li>
              <li>• No pressure - it's completely optional!</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "journal-magic",
      title: "Automatic Journaling ✨",
      description: "Your conversations automatically become meaningful journal entries.",
      icon: BookOpen,
      targetSection: "journal",
      content: (
        <div className="py-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-purple-500" />
              <h4 className="font-semibold text-gray-800">How Auto-Journaling Works</h4>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800">You have a conversation</p>
                  <p className="text-sm text-gray-600">Share your thoughts and feelings in the chat</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800">AI creates a journal entry</p>
                  <p className="text-sm text-gray-600">Key insights and emotions are captured automatically</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800">Track your journey</p>
                  <p className="text-sm text-gray-600">Review patterns and growth over time</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Benefits of Auto-Journaling</span>
            </div>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• No need to remember to write entries</li>
              <li>• Captures insights you might miss</li>
              <li>• Creates a timeline of your wellness journey</li>
              <li>• Helps identify patterns and triggers</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "privacy-safety",
      title: "Your Privacy & Safety",
      description: "Understanding the boundaries and getting the most from your companion.",
      icon: Shield,
      content: (
        <div className="py-4">
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 mb-3">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">What This Companion Provides</span>
              </div>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Emotional validation and support</li>
                <li>• Help processing thoughts and feelings</li>
                <li>• Coping strategies and perspective</li>
                <li>• A safe space to express yourself</li>
                <li>• Automatic wellness tracking</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-700 mb-3">
                <Heart className="h-5 w-5" />
                <span className="font-semibold">Important to Remember</span>
              </div>
              <ul className="text-sm text-amber-600 space-y-1">
                <li>• This is supportive companionship, not professional therapy</li>
                <li>• Your data stays private and secure</li>
                <li>• For serious mental health concerns, seek professional help</li>
                <li>• Crisis resources are available if you need immediate support</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">When to Seek Additional Help</span>
              </div>
              <p className="text-sm text-blue-600">
                If you're experiencing thoughts of self-harm, severe depression, or mental health crises, please reach
                out to a mental health professional, crisis hotline, or emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ready-to-start",
      title: "You're All Set! 🎉",
      description: "Ready to begin your wellness journey? Let's start with your first conversation.",
      icon: Play,
      targetSection: "chat",
      content: (
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to your wellness journey!</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            You now know how to use your wellness companion. Remember, this is your safe space to share, reflect, and
            grow. Take it one conversation at a time.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Quick Start Tips:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Start with how you're feeling right now</p>
              <p>• Share whatever is on your mind - big or small</p>
              <p>• Don't worry about being "perfect" - just be authentic</p>
              <p>• Check your journal regularly to see your progress</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            You can always revisit this tutorial from the settings menu if you need a refresher.
          </p>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const currentStepData = tutorialSteps[currentStep]
      setCompletedSteps((prev) => [...prev, currentStepData.id])

      if (currentStepData.targetSection) {
        onSectionChange(currentStepData.targetSection)
      }

      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("wellness-onboarding-completed", "true")
    onClose()
  }

  const handleComplete = () => {
    localStorage.setItem("wellness-onboarding-completed", "true")
    onSectionChange("chat")
    onClose()
  }

  const currentStepData = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <currentStepData.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">{currentStepData.title}</DialogTitle>
                <DialogDescription className="text-base">{currentStepData.description}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6">{currentStepData.content}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSkip} className="text-gray-600">
              Skip Tutorial
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            {isLastStep ? (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                Start My Journey
                <Play className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
