"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, Sparkles, User, Settings, LogOut, Crown, Menu, Moon, Sun } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AppHeaderProps {
  onLoginClick: () => void
  onPricingClick: () => void
  onMenuClick: () => void
  handleLogout: () => void
  isAuthenticated?: boolean
  userEmail?: string
  isPremium?: boolean
  isDarkMode?: boolean
  onToggleDarkMode?: () => void
}

export function AppHeader({
  onLoginClick,
  onPricingClick,
  onMenuClick,
  isAuthenticated = false,
  userEmail = "",
  isPremium = false,
  isDarkMode = true,
  onToggleDarkMode,
  handleLogout,
}: AppHeaderProps) {
  const onLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Error signing out:", error.message)
        return
      }

      handleLogout()
    } catch (err) {
      console.error("Unexpected error during logout:", err)
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-purple-200 shadow-sm sticky top-0 z-40 dark:bg-gray-800/95 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.dispatchEvent(new CustomEvent("go-home"))}
          >
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Liora Journal
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block dark:text-gray-400">
                  Your personal mental health support
                </p>
              </div>
            </div>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={onToggleDarkMode}
                  className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 p-2"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  onClick={onPricingClick}
                  className="hidden sm:flex text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                >
                  Pricing
                </Button>
                <Button
                  variant="outline"
                  onClick={onLoginClick}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                  Sign In
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={onToggleDarkMode}
                  className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 p-2"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 hidden sm:flex">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{userEmail}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {isPremium ? "Premium Member" : "Free Account"}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    {!isPremium && (
                      <>
                        <DropdownMenuItem onClick={onPricingClick}>
                          <Crown className="mr-2 h-4 w-4" />
                          <span>Upgrade to Premium</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
