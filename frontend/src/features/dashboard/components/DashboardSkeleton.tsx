export function DashboardSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-6">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 