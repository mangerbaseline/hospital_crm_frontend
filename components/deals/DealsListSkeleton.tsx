"use client";

export function DealsListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="py-4 px-5">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </th>
              ))}
              <th className="py-4 px-5 w-24">
                <div className="h-3 w-14 bg-muted rounded animate-pulse ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 8 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                <td className="py-4 px-5">
                  <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                </td>
                <td className="py-4 px-5">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </td>
                <td className="py-4 px-5">
                  <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                </td>
                <td className="py-4 px-5">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </td>
                <td className="py-4 px-5">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                </td>
                <td className="py-4 px-5">
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                </td>
                <td className="py-4 px-5">
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                </td>
                <td className="py-4 px-5">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                    <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
