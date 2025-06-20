"use client"

import React from "react"
import { useState, useEffect } from "react"
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
import { useAuth } from "@/components/supabase-auth-provider"
import { AuthModal } from "@/components/auth-modal"
import { NavigationItem } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import {
  Heart,
  Sparkles,
  X,
  Home,
  MessageCircle,
  BookOpen,
  Settings,
  User,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const pathname = usePathname()

  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const onLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error.message)
        return
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err)
    }
  }

  const navigationItems: NavigationItem[] = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "chat", label: "Chat Support", icon: MessageCircle, href: "/chat" },
    { id: "journal", label: "My Journal", icon: BookOpen, href: "/journal" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]

  const getCurrentSection = () => {
    if (pathname === "/") return "home"
    if (pathname === "/chat") return "chat"
    if (pathname === "/journal") return "journal"
    if (pathname === "/settings") return "settings"
    return "home"
  }

  const currentSection = getCurrentSection()

  return (
    <>
      {/* Fixed Sidebar Navigation */}
      <nav
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${
          sidebarHovered || sidebarOpen ? "w-64" : "w-16"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-full bg-white/95 backdrop-blur-sm border-r border-purple-200 shadow-lg dark:bg-gray-800/95 dark:border-gray-700">
          {/* Logo Section */}
          <header className="p-4 border-b border-purple-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <Sparkles className="h-2 w-2 text-yellow-400 absolute -top-1 -right-1 animate-bounce" aria-hidden="true" />
              </div>
              {(sidebarHovered || sidebarOpen) && (
                <div className="overflow-hidden">
                  <h1 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                    Liora Journal
                  </h1>
                </div>
              )}
            </div>
          </header>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1" role="navigation" aria-label="Section navigation">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 transition-all duration-200 ${
                      currentSection === item.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                        : "hover:bg-purple-50 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    } ${!(sidebarHovered || sidebarOpen) ? "px-3" : "px-4"}`}
                    onClick={() => setSidebarOpen(false)}
                    aria-current={currentSection === item.id ? "page" : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {(sidebarHovered || sidebarOpen) && (
                      <span className="ml-3 whitespace-nowrap overflow-hidden">{item.label}</span>
                    )}
                    {item.badge && (sidebarHovered || sidebarOpen) && (
                      <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700 text-xs dark:bg-purple-900 dark:text-purple-100">
                        {item.badge > 99 ? "99+" : item.badge}
                      </Badge>
                    )}
                    {item.badge && !(sidebarHovered || sidebarOpen) && item.badge > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{item.badge > 9 ? "9+" : item.badge}</span>
                      </div>
                    )}
                  </Button>
                </Link>
              </div>
            ))}
          </nav>

          {/* Close button for mobile */}
          <div className="lg:hidden absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Bottom disclaimer - only show when expanded */}
          {(sidebarHovered || sidebarOpen) && (
            <aside className="absolute bottom-4 left-2 right-2">
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg dark:from-amber-900/50 dark:to-orange-900/50 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <div className="text-xs text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">Supportive companion</p>
                    <p>Not professional therapy.</p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </nav>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* Top Header with Logo and User Actions */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-purple-200 shadow-sm sticky top-0 z-40 dark:bg-gray-800/95 dark:border-gray-700 lg:ml-16">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
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

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {isLoading ? null : !isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 p-2"
                  >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAuthModal(true)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 p-2"
                  >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
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
                        <p className="text-sm font-medium leading-none">{user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          Free Account
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
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

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
} 