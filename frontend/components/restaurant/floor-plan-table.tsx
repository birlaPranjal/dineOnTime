"use client"

import { cn } from "@/lib/utils"

interface FloorPlanTableProps {
  id: string
  name: string
  number?: string // Table number to display
  type: string
  capacity: number
  x: number
  y: number
  status: "available" | "occupied" | "reserved" | "cleaning" | "maintenance"
  isSelected?: boolean
  onClick?: () => void
}

const statusColors: Record<string, { bg: string; stroke: string; fill: string }> = {
  available: { bg: "#22c55e", stroke: "#15803d", fill: "#dcfce7" },
  occupied: { bg: "#ef4444", stroke: "#b91c1c", fill: "#fee2e2" },
  reserved: { bg: "#f59e0b", stroke: "#b45309", fill: "#fef3c7" },
  cleaning: { bg: "#8b5cf6", stroke: "#6d28d9", fill: "#ede9fe" },
  maintenance: { bg: "#6b7280", stroke: "#374151", fill: "#f3f4f6" },
}

export function FloorPlanTable({ id, name, number, type, capacity, x, y, status, isSelected, onClick }: FloorPlanTableProps) {
  const colors = statusColors[status]

  const renderTable = () => {
    switch (type) {
      case "round-2":
        return (
          <g>
            {/* Table */}
            <circle cx={40} cy={40} r={20} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />
            {/* Chairs */}
            <rect x={32} y={5} width={16} height={10} rx={3} fill={colors.bg} />
            <rect x={32} y={65} width={16} height={10} rx={3} fill={colors.bg} />
          </g>
        )
      case "round-4":
        return (
          <g>
            <circle cx={40} cy={40} r={25} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />
            <rect x={32} y={2} width={16} height={10} rx={3} fill={colors.bg} />
            <rect x={32} y={68} width={16} height={10} rx={3} fill={colors.bg} />
            <rect x={2} y={32} width={10} height={16} rx={3} fill={colors.bg} />
            <rect x={68} y={32} width={10} height={16} rx={3} fill={colors.bg} />
          </g>
        )
      case "round-6":
        return (
          <g>
            <circle cx={50} cy={50} r={30} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />
            <rect x={42} y={5} width={16} height={10} rx={3} fill={colors.bg} />
            <rect x={42} y={85} width={16} height={10} rx={3} fill={colors.bg} />
            <rect x={5} y={42} width={10} height={16} rx={3} fill={colors.bg} />
            <rect x={85} y={42} width={10} height={16} rx={3} fill={colors.bg} />
            <rect x={12} y={12} width={14} height={10} rx={3} fill={colors.bg} transform="rotate(-45 19 17)" />
            <rect x={74} y={78} width={14} height={10} rx={3} fill={colors.bg} transform="rotate(-45 81 83)" />
          </g>
        )
      case "square-4":
        return (
          <g>
            <rect
              x={15}
              y={20}
              width={50}
              height={40}
              rx={4}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={2}
            />
            <rect x={28} y={5} width={24} height={10} rx={3} fill={colors.bg} />
            <rect x={28} y={65} width={24} height={10} rx={3} fill={colors.bg} />
            <rect x={2} y={32} width={10} height={16} rx={3} fill={colors.bg} />
            <rect x={68} y={32} width={10} height={16} rx={3} fill={colors.bg} />
          </g>
        )
      case "rect-6":
        return (
          <g>
            <rect
              x={10}
              y={25}
              width={80}
              height={40}
              rx={4}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={2}
            />
            <rect x={18} y={8} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={42} y={8} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={66} y={8} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={18} y={72} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={42} y={72} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={66} y={72} width={20} height={10} rx={3} fill={colors.bg} />
          </g>
        )
      case "rect-8":
        return (
          <g>
            <rect
              x={10}
              y={25}
              width={120}
              height={50}
              rx={4}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={2}
            />
            <rect x={18} y={8} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={45} y={8} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={72} y={8} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={100} y={8} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={18} y={82} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={45} y={82} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={72} y={82} width={20} height={10} rx={3} fill={colors.bg} />
            <rect x={100} y={82} width={20} height={10} rx={3} fill={colors.bg} />
          </g>
        )
      case "rect-10":
        return (
          <g>
            <rect
              x={10}
              y={25}
              width={160}
              height={50}
              rx={4}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={2}
            />
            <rect x={18} y={8} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={42} y={8} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={66} y={8} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={90} y={8} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={114} y={8} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={18} y={82} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={42} y={82} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={66} y={82} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={90} y={82} width={18} height={10} rx={3} fill={colors.bg} />
            <rect x={114} y={82} width={18} height={10} rx={3} fill={colors.bg} />
          </g>
        )
      case "diamond-4":
        return (
          <g>
            <rect
              x={20}
              y={20}
              width={40}
              height={40}
              rx={4}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={2}
              transform="rotate(45 40 40)"
            />
            <rect x={32} y={2} width={16} height={10} rx={3} fill={colors.bg} />
            <rect x={32} y={68} width={16} height={10} rx={3} fill={colors.bg} />
            <rect x={2} y={32} width={10} height={16} rx={3} fill={colors.bg} />
            <rect x={68} y={32} width={10} height={16} rx={3} fill={colors.bg} />
          </g>
        )
      default:
        return (
          <g>
            <rect
              x={15}
              y={20}
              width={50}
              height={40}
              rx={4}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={2}
            />
          </g>
        )
    }
  }

  const getWidth = () => {
    if (type === "rect-10") return 180
    if (type === "rect-8") return 140
    if (type === "rect-6") return 100
    if (type === "round-6") return 100
    return 80
  }

  const getHeight = () => {
    if (type === "rect-10" || type === "rect-8" || type === "rect-6") return 100
    if (type === "round-6") return 100
    return 80
  }

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      className={cn("cursor-pointer transition-transform hover:scale-105", isSelected && "drop-shadow-lg")}
    >
      {isSelected && (
        <rect
          x={-5}
          y={-5}
          width={getWidth() + 10}
          height={getHeight() + 10}
          rx={8}
          fill="none"
          stroke="#DC0000"
          strokeWidth={3}
          strokeDasharray="5,5"
        />
      )}
      {renderTable()}
      <text
        x={getWidth() / 2}
        y={getHeight() / 2 + 4}
        textAnchor="middle"
        className="text-xs font-semibold fill-navy pointer-events-none"
      >
        {number || name}
      </text>
    </g>
  )
}
