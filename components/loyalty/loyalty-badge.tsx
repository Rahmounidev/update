"use client"

import { Star, Gift, Trophy, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface LoyaltyBadgeProps {
  points: number
  totalEarned: number
  size?: "sm" | "md" | "lg"
  showPoints?: boolean
  clickable?: boolean
}

const loyaltyLevels = [
  { name: "Bronze", minPoints: 0, color: "text-amber-600", bgColor: "bg-amber-50", icon: Star },
  { name: "Argent", minPoints: 500, color: "text-gray-500", bgColor: "bg-gray-50", icon: Gift },
  { name: "Or", minPoints: 1500, color: "text-yellow-500", bgColor: "bg-yellow-50", icon: Trophy },
  { name: "Platine", minPoints: 3000, color: "text-purple-600", bgColor: "bg-purple-50", icon: Crown },
]

export default function LoyaltyBadge({
  points,
  totalEarned,
  size = "md",
  showPoints = true,
  clickable = true,
}: LoyaltyBadgeProps) {
  const getCurrentLevel = () => {
    return (
      loyaltyLevels
        .slice()
        .reverse()
        .find((level) => totalEarned >= level.minPoints) || loyaltyLevels[0]
    )
  }

  const currentLevel = getCurrentLevel()
  const IconComponent = currentLevel.icon

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const BadgeContent = () => (
    <div className="flex items-center space-x-2">
      <Badge
        variant="outline"
        className={`${currentLevel.bgColor} border-current ${clickable ? "hover:shadow-md transition-shadow cursor-pointer" : ""}`}
      >
        <IconComponent className={`${sizeClasses[size]} ${currentLevel.color} mr-1`} />
        <span className={currentLevel.color}>{currentLevel.name}</span>
      </Badge>
      {showPoints && (
        <Badge
          variant="secondary"
          className={`bg-purple-100 text-purple-700 ${clickable ? "hover:shadow-md transition-shadow cursor-pointer" : ""}`}
        >
          {points} pts
        </Badge>
      )}
    </div>
  )

  if (clickable) {
    return (
      <Link href="/loyalty" className="flex items-center space-x-2">
        <BadgeContent />
      </Link>
    )
  }

  return <BadgeContent />
}
