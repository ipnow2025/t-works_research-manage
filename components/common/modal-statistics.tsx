"use client"

interface ModalStatisticsProps {
  statistics: Array<{
    label: string
    value: string | number
    color: string
  }>
}

export function ModalStatistics({ statistics }: ModalStatisticsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {statistics.map((stat, index) => (
        <div key={index} className={`text-center p-3 ${stat.color} rounded-lg border`}>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
