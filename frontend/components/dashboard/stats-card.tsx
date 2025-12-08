import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  description?: string
}

export function StatsCard({ title, value, change, changeType = "neutral", icon, description }: StatsCardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-navy">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-xs font-medium",
                  changeType === "positive" && "text-green-600",
                  changeType === "negative" && "text-red-600",
                  changeType === "neutral" && "text-muted-foreground",
                )}
              >
                {change}
              </p>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
