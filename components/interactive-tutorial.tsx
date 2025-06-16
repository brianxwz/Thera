"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight, ArrowLeft, Target, Sparkles, Heart } from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  targetSelector?: string
  position: "top" | "bottom" | "left" | "right" | "center"
  action?: "click" | "hover" | "type" | "none"
  content: React.ReactNode
  section?: string
}

interface InteractiveTutorialProps {
  isActive: boolean
  onComplete: () => void
  onSectionChange: (section: string) => void
  currentSection: string
}

export function InteractiveTutorial({
  isActive,
  onComplete,
  onSectionChange,
  currentSection,
}: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to Your Wellness Journey! 🌟",
      description: "Let's take an interactive tour of your wellness companion",
      position: "center",
      action: "none",
      content: (
        <div className="text-center p-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Heart className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Ready to explore?</h3>
          <p className="text-gray-600 mb-6 dark:text-gray-300">
            This interactive tutorial will guide you through the actual interface. You'll be able to click and interact
            with real elements!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400">
            <Target className="h-4 w-4" />
            <span>Interactive elements will be highlighted</span>
          </div>
        </div>
      ),
    },
    {
      id: "navigation",
      title: "Navigation Sidebar",
      description: "This is your main navigation. Hover over it to see it expand!",
      targetSelector: ".tutorial-sidebar",
      position: "right",
      action: "hover",
      content: (
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 dark:text-white">Try hovering over the sidebar</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            The sidebar shows icons by default, but expands when you hover to reveal labels and badges.
          </p>
          <div className="bg-purple-50 rounded-lg p-3 dark:bg-purple-900/20">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              💡 <strong>Tip:</strong> The sidebar stays collapsed to save space but gives you quick access to all
              sections.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "home-section",
      title: "Home Section",
      description: "Click on the Home icon to see your wellness dashboard",
      targetSelector: ".tutorial-nav-home",
      position: "right",
      action: "click",
      section: "home",
      content: (
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 dark:text-white">Click the Home icon</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            The home section gives you an overview of your wellness companion and its features.
          </p>
        </div>
      ),
    },
    {
      id: "start-journey",
      title: "Start Your Journey",
      description: "Click this button to begin using the chat feature",
      targetSelector: ".tutorial-start-journey",
      position: "top",
      action: "click",
      content: (
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 dark:text-white">Ready to start?</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            This button will take you directly to the chat section where you can begin your wellness conversation.
          </p>
          <div className="bg-blue-50 rounded-lg p-3 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              🚀 <strong>Try it:</strong> Click the button to navigate to the chat section!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "chat-section",
      title: "Chat Support",
      description: "This is where you'll have conversations with your AI wellness companion",
      targetSelector: ".tutorial-chat-area",
      position: "top",
      action: "none",
      section: "chat",
      content: (
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 dark:text-white">Your Safe Space</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            Share your thoughts, feelings, and concerns here. Your AI companion will provide supportive responses.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Completely private</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>No judgment</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "mood-selection",
      title: "Mood Selection",
      description: "Select how you're feeling to help contextualize your conversation",
      targetSelector: ".tutorial-mood-buttons",
      position: "bottom",
      action: "click",
      content: (
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 dark:text-white">How are you feeling?</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            Try clicking on one of the mood buttons. This helps your companion understand your current emotional state.
          </p>
          <div className="bg-amber-50 rounded-lg p-3 dark:bg-amber-900/20">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              ✨ <strong>Optional:</strong> You can skip mood selection if you prefer, but it helps provide better
              support.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "chat-input",
      title: "Share Your Thoughts",
      description: "Type anything you'd like to share in this input field",
      targetSelector: ".tutorial-chat-input",
      position: "top",
      action: "type",
      content: (
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 dark:text-white">Start a conversation</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            Try typing something like "I'm feeling a bit stressed today" or "I had a great day!"
          </p>
          <div className="bg-green-50 rounded-lg p-3 dark:bg-green-900/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              💬 <strong>Remember:</strong> This is a safe space to express yourself freely.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "journal-nav",
      title: "Journal Section",
      description: "Click here to view your automatically generated journal entries",
      targetSelector: ".tutorial-nav-journal",
      position: "right",
      action: "click",
      section: "journal",
      content: (
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 dark:text-white">Your Wellness Journal</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            Your conversations are automatically turned into meaningful journal entries that you can review and reflect
            on.
          </p>
        </div>
      ),
    },
    {
      id: "journal-features",
      title: "Journal Features",
      description: "Explore the powerful features for organizing your wellness journey",
      targetSelector: ".tutorial-journal-filters",
      position: "bottom",
      action: "none",
      content: (
        <div className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3 dark:text-white">Organize Your Journey</h4>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            Use search, filters, and sorting to find specific entries and track your progress over time.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 rounded p-2 dark:bg-blue-900/20">
              <span className="text-blue-700 dark:text-blue-300">🔍 Search entries</span>
            </div>
            <div className="bg-purple-50 rounded p-2 dark:bg-purple-900/20">
              <span className="text-purple-700 dark:text-purple-300">🏷️ Filter by tags</span>
            </div>
            <div className="bg-green-50 rounded p-2 dark:bg-green-900/20">
              <span className="text-green-700 dark:text-green-300">😊 Filter by mood</span>
            </div>
            <div className="bg-orange-50 rounded p-2 dark:bg-orange-900/20">
              <span className="text-orange-700 dark:text-orange-300">📅 Date ranges</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "complete",
      title: "You're All Set! 🎉",
      description: "You've completed the interactive tour",
      position: "center",
      action: "none",
      content: (
        <div className="text-center p-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Tutorial Complete!</h3>
          <p className="text-gray-600 mb-6 dark:text-gray-300">
            You now know how to navigate and use your wellness companion. Remember, this is your safe space to grow and
            reflect.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4 dark:from-purple-900/20 dark:to-pink-900/20">
            <h4 className="font-semibold text-gray-800 mb-2 dark:text-white">Quick Recap:</h4>
            <div className="text-sm text-gray-700 space-y-1 dark:text-gray-300">
              <p>• Use the sidebar to navigate between sections</p>
              <p>• Share your thoughts in the chat for support</p>
              <p>• Review your journey in the journal section</p>
              <p>• Everything is private and secure</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      updateTargetElement()
    } else {
      setIsVisible(false)
    }
  }, [isActive, currentStep])

  useEffect(() => {
    if (isActive) {
      updateTargetElement()
    }
  }, [currentStep, currentSection])

  const updateTargetElement = () => {
    const step = tutorialSteps[currentStep]
    if (step.targetSelector) {
      const element = document.querySelector(step.targetSelector) as HTMLElement
      if (element) {
        setTargetElement(element)
        updateTooltipPosition(element, step.position)
        highlightElement(element)
      }
    } else {
      setTargetElement(null)
      removeHighlight()
    }
  }

  const updateTooltipPosition = (element: HTMLElement, position: string) => {
    const rect = element.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    let top = 0
    let left = 0

    switch (position) {
      case "top":
        top = rect.top + scrollTop - 10
        left = rect.left + scrollLeft + rect.width / 2
        break
      case "bottom":
        top = rect.bottom + scrollTop + 10
        left = rect.left + scrollLeft + rect.width / 2
        break
      case "left":
        top = rect.top + scrollTop + rect.height / 2
        left = rect.left + scrollLeft - 10
        break
      case "right":
        top = rect.top + scrollTop + rect.height / 2
        left = rect.right + scrollLeft + 10
        break
      case "center":
        top = window.innerHeight / 2 + scrollTop
        left = window.innerWidth / 2 + scrollLeft
        break
    }

    setTooltipPosition({ top, left })
  }

  const highlightElement = (element: HTMLElement) => {
    removeHighlight()
    element.classList.add("tutorial-highlight")
    element.style.position = "relative"
    element.style.zIndex = "1001"

    // Add pulsing effect
    const pulseKeyframes = `
      @keyframes tutorial-pulse {
        0% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(147, 51, 234, 0); }
        100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
      }
    `

    if (!document.getElementById("tutorial-styles")) {
      const style = document.createElement("style")
      style.id = "tutorial-styles"
      style.textContent =
        pulseKeyframes +
        `
        .tutorial-highlight {
          animation: tutorial-pulse 2s infinite;
          border-radius: 8px;
        }
      `
      document.head.appendChild(style)
    }
  }

  const removeHighlight = () => {
    const highlighted = document.querySelector(".tutorial-highlight")
    if (highlighted) {
      highlighted.classList.remove("tutorial-highlight")
      highlighted.style.position = ""
      highlighted.style.zIndex = ""
    }
  }

  const handleNext = () => {
    const step = tutorialSteps[currentStep]

    // If step requires section change, do it
    if (step.section) {
      onSectionChange(step.section)
    }

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    removeHighlight()
    const style = document.getElementById("tutorial-styles")
    if (style) {
      style.remove()
    }
    onComplete()
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible) return null

  const currentStepData = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1
  const isCenterPosition = currentStepData.position === "center"

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[1000] pointer-events-none"
        style={{ pointerEvents: targetElement ? "none" : "auto" }}
      />

      {/* Tooltip */}
      <div
        className={`fixed z-[1002] transition-all duration-300 ${
          isCenterPosition ? "transform -translate-x-1/2 -translate-y-1/2" : ""
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: isCenterPosition
            ? "translate(-50%, -50%)"
            : currentStepData.position === "right"
              ? "translateY(-50%)"
              : currentStepData.position === "left"
                ? "translate(-100%, -50%)"
                : currentStepData.position === "top"
                  ? "translate(-50%, -100%)"
                  : "translate(-50%, 0%)",
        }}
      >
        <Card className={`shadow-2xl border-2 border-purple-200 max-w-sm ${isCenterPosition ? "max-w-md" : ""}`}>
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <h3 className="font-bold text-lg">{currentStepData.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-purple-100 text-sm">{currentStepData.description}</p>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800">{currentStepData.content}</div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </Badge>
                  {currentStepData.action && currentStepData.action !== "none" && (
                    <Badge className="text-xs bg-blue-100 text-blue-700">
                      {currentStepData.action === "click" && "👆 Click"}
                      {currentStepData.action === "hover" && "🖱️ Hover"}
                      {currentStepData.action === "type" && "⌨️ Type"}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <Button variant="outline" size="sm" onClick={handlePrevious}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className={
                      isLastStep
                        ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    }
                  >
                    {isLastStep ? "Complete" : "Next"}
                    {!isLastStep && <ArrowRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arrow pointer for non-center positions */}
        {!isCenterPosition && (
          <div
            className={`absolute w-0 h-0 ${
              currentStepData.position === "top"
                ? "border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white top-full left-1/2 transform -translate-x-1/2"
                : currentStepData.position === "bottom"
                  ? "border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white bottom-full left-1/2 transform -translate-x-1/2"
                  : currentStepData.position === "left"
                    ? "border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white left-full top-1/2 transform -translate-y-1/2"
                    : "border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white right-full top-1/2 transform -translate-y-1/2"
            }`}
          />
        )}
      </div>
    </>
  )
}
