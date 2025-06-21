import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Journal - Your Personal Wellness Companion",
  description: "Track your wellness journey with our smart journaling feature. Automatically capture insights from conversations or write manual entries to monitor your mental health progress.",
  keywords: "journal, wellness, mental health, mood tracking, self-reflection, personal growth",
  openGraph: {
    title: "Journal - Your Personal Wellness Companion",
    description: "Track your wellness journey with our smart journaling feature. Automatically capture insights from conversations or write manual entries to monitor your mental health progress.",
    type: "website",
  },
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 