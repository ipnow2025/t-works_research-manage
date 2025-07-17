import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="space-y-4">
        <div className="flex space-x-4 overflow-x-auto">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
        </div>
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    </div>
  )
}
