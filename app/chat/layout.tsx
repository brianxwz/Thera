import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chat Support - AI Wellness Companion",
  description: "Get 24/7 emotional support from a compassionate AI companion. Share your thoughts and feelings in a safe, judgment-free space.",
  keywords: [
    "AI chat support",
    "emotional support",
    "mental health chat",
    "AI therapy",
    "wellness companion",
    "mental health support",
    "AI mental health",
    "emotional wellness chat",
  ],
  openGraph: {
    title: "Chat Support - AI Wellness Companion",
    description: "Get 24/7 emotional support from a compassionate AI companion. Share your thoughts and feelings in a safe, judgment-free space.",
    url: "https://liorajournal.com/chat",
  },
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 