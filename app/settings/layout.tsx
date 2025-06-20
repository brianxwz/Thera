import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings - Customize Your Experience",
  description: "Customize your wellness companion experience. Manage your account, privacy settings, and app preferences.",
  keywords: [
    "wellness app settings",
    "mental health app settings",
    "privacy settings",
    "account management",
    "app customization",
    "user preferences",
  ],
  openGraph: {
    title: "Settings - Customize Your Experience",
    description: "Customize your wellness companion experience. Manage your account, privacy settings, and app preferences.",
    url: "https://liorajournal.com/settings",
  },
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 