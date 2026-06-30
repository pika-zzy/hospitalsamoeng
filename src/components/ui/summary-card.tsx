import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FileText, Calendar, Users, TrendingUp, Activity, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface SummaryCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  accent?: string
  trend?: {
    value: number
    isPositive?: boolean
    label?: string
  }
  className?: string
  variant?: "default" | "compact" | "detailed"
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  accent = "bg-blue-50 text-blue-600",
  trend,
  className,
  variant = "default",
}: SummaryCardProps) {
  const Icon = icon || FileText

  const getAccentClasses = () => {
    if (accent.startsWith('#')) {
      return {
        bg: 'bg-opacity-10 bg-white',
        text: 'text-[hsl(var(--tw-color))]',
        border: 'border-[hsl(var(--tw-color))]/20'
      }
    }
    return {
      bg: accent.includes('bg-') ? accent.replace('text-', 'bg-opacity-10 bg-') : 'bg-gray-50',
      text: accent.includes('text-') ? accent : 'text-gray-600',
      border: 'border-gray-200'
    }
  }

  const accentClasses = getAccentClasses()

  const variants = {
    default: "p-6",
    compact: "p-4",
    detailed: "p-8"
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        variants[variant],
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-xs text-gray-500 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center ml-4 shrink-0",
            accentClasses.bg,
            accentClasses.text,
            accentClasses.border,
            "border"
          )}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <div className="text-3xl font-bold text-gray-900 tabular-nums">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <div className={cn(
                  "w-1 h-1 rounded-full",
                  trend.isPositive ? "bg-green-500" : "bg-red-500"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
                >
                  {trend.isPositive ? "▲" : "▼"} {Math.abs(trend.value)}%
                </span>
                {trend.label && (
                  <span className="text-xs text-gray-500 ml-1">
                    {trend.label}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              สถิติ
            </div>
            <div className={cn(
              "w-8 h-1 rounded-full",
              accentClasses.bg,
              accentClasses.text
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Predefined summary cards for common metrics
export function NewsSummaryCard({ value, trend }: { value: number; trend?: { value: number; isPositive?: boolean } }) {
  return (
    <SummaryCard
      title="จำนวนข่าว"
      value={value}
      subtitle="ข่าวประชาสัมพันธ์ทั้งหมด"
      icon={FileText}
      accent="bg-teal-50 text-teal-600"
      trend={trend}
      variant="default"
    />
  )
}

export function ActivitySummaryCard({ value, trend }: { value: number; trend?: { value: number; isPositive?: boolean } }) {
  return (
    <SummaryCard
      title="กิจกรรม"
      value={value}
      subtitle="กิจกรรมที่เผยแพร่แล้ว"
      icon={Calendar}
      accent="bg-amber-50 text-amber-600"
      trend={trend}
      variant="default"
    />
  )
}

export function StaffSummaryCard({ value, trend }: { value: number; trend?: { value: number; isPositive?: boolean } }) {
  return (
    <SummaryCard
      title="เจ้าหน้าที่"
      value={value}
      subtitle="บุคลากรในระบบ"
      icon={Users}
      accent="bg-slate-50 text-slate-600"
      trend={trend}
      variant="default"
    />
  )
}

export function DocumentSummaryCard({ value, trend }: { value: number; trend?: { value: number; isPositive?: boolean } }) {
  return (
    <SummaryCard
      title="เอกสาร ITA"
      value={value}
      subtitle="เอกสารทั้งหมดที่จัดเก็บ"
      icon={CheckCircle}
      accent="bg-emerald-50 text-emerald-600"
      trend={trend}
      variant="default"
    />
  )
}

export function ActivitySummary({ stats, className }: {
  stats: Array<{
    title: string;
    value: number | string;
    subtitle?: string;
    icon?: React.ComponentType<{ className?: string }>;
    accent?: string;
    trend?: { value: number; isPositive?: boolean; label?: string };
  }>;
  className?: string;
} ) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
      className
    )}
    >
      {stats.map((stat, index) => (
        <SummaryCard
          key={index}
          {...stat}
          variant="default"
        />
      ))}
    </div>
  )
}

export { SummaryCard }