import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Journal - Wellness Tracking",
  description: "Track your wellness journey with smart journaling. Automatically capture insights from conversations or write manual entries to monitor your mental health progress.",
  keywords: [
    "wellness journal",
    "mental health journal",
    "journaling app",
    "wellness tracking",
    "mental health tracking",
    "mood journal",
    "emotional wellness",
    "self-reflection",
  ],
  openGraph: {
    title: "My Journal - Wellness Tracking",
    description: "Track your wellness journey with smart journaling. Automatically capture insights from conversations or write manual entries to monitor your mental health progress.",
    url: "https://liorajournal.com/journal",
  },
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 