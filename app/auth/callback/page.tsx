"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Sparkles } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Wait a moment to let Supabase process the session, then redirect
    const timeout = setTimeout(() => {
      router.replace("/")
    }, 1500)
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-xl bg-white/90 dark:bg-gray-900/90 border border-purple-200 dark:border-purple-800">
        <div className="relative mb-2">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-8 w-8 text-white animate-pulse" />
          </div>
          <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Welcome back!</h2>
        <p className="text-base text-gray-600 dark:text-gray-300 text-center max-w-xs">
          We&apos;re finishing up your sign-in. You&apos;ll be redirected in a moment.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-150" />
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300" />
        </div>
      </div>
    </div>
  )
} 