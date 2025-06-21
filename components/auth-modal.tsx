"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mail, Lock, User, Check, Crown, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/supabase-auth-provider"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [, setIsSignUp] = useState(false)

  // Password validation
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    //hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const characterRequirements = [
    passwordRequirements.hasUppercase,
    passwordRequirements.hasLowercase,
    passwordRequirements.hasNumber,
    //passwordRequirements.hasSpecialChar,
  ]

  const metCharacterRequirements = characterRequirements.filter(Boolean).length
  const isPasswordValid = passwordRequirements.minLength && metCharacterRequirements >= 3
  const passwordsMatch = password === confirmPassword
  const isSignUpValid = isPasswordValid && passwordsMatch

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        onClose()
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.")
      setIsLoading(false)
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match. Please try again.")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        onClose()
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google') => {
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // OAuth will redirect to the callback URL
      // The callback will handle the authentication
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setIsSignUp(value === "signup")
    setError("")
  }

  const premiumFeatures = [
    "Unlimited journal entries",
    "Advanced mood analytics",
    "Export your data",
    "Priority support",
    "Custom journal templates",
    "Mood trend visualizations",
    "Backup & sync across devices",
    "Advanced search & filtering",
  ]

  // Optionally, auto-close modal if already authenticated
  if (isAuthenticated && isOpen) {
    onClose()
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Welcome to Liora Journal</DialogTitle>
              <DialogDescription>Sign in to access all features and sync your wellness journey</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Tabs defaultValue="signin" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-3">
            <form onSubmit={handleSignIn} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 h-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 h-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-10"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">OR</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
                variant="outline"
                className="w-full h-10"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>
                
                {/* Password Requirements */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-700">Password Requirements:</p>
                  </div>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.minLength ? 'bg-green-500' : 'bg-gray-300'}`} />
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasUppercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                      One uppercase letter (A-Z)
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasLowercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                      One lowercase letter (a-z)
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`} />
                      One number (0-9)
                    </div>
                    {/*<div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasSpecialChar ? 'bg-green-500' : 'bg-gray-300'}`} />
                      One special character (!@#$%^&*)
                    </div>*/}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`pl-10 ${confirmPassword && !passwordsMatch ? 'border-red-300 focus:border-red-500' : confirmPassword && passwordsMatch ? 'border-green-300 focus:border-green-500' : ''}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {confirmPassword && (
                  <p className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isSignUpValid}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">OR</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
                variant="outline"
                className="w-full h-10"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Premium Features Preview */}
      </DialogContent>
    </Dialog>
  )
}
