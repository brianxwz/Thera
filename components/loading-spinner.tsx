import { Heart } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-pulse`}>
        <Heart className="w-full h-full text-purple-500" aria-hidden="true" />
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{text}</p>
      )}
    </div>
  )
} 