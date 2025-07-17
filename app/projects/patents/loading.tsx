import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function PatentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <Skeleton className="h-10 w-full max-w-md mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-48" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 w-1/6">
                    <Skeleton className="h-4 w-full" />
                  </th>
                  <th className="text-left py-3 w-2/6">
                    <Skeleton className="h-4 w-full" />
                  </th>
                  <th className="text-left py-3 w-1/6">
                    <Skeleton className="h-4 w-full" />
                  </th>
                  <th className="text-left py-3 w-1/6">
                    <Skeleton className="h-4 w-full" />
                  </th>
                  <th className="text-left py-3 w-1/6">
                    <Skeleton className="h-4 w-full" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                      <td className="py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                      <td className="py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                      <td className="py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
