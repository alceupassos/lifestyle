export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-portrait shimmer" style={{ borderRadius: '2px' }} />
      <div className="pt-4 space-y-2">
        <div className="h-3 w-16 shimmer rounded" />
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-4 w-2/3 shimmer rounded" />
        <div className="h-4 w-20 shimmer rounded" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-3">
          <div className="aspect-portrait shimmer" style={{ borderRadius: '2px' }} />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square shimmer" style={{ borderRadius: '2px' }} />
            ))}
          </div>
        </div>
        <div className="space-y-6 pt-4">
          <div className="h-4 w-24 shimmer rounded" />
          <div className="space-y-2">
            <div className="h-10 w-3/4 shimmer rounded" />
            <div className="h-10 w-1/2 shimmer rounded" />
          </div>
          <div className="h-8 w-32 shimmer rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full shimmer rounded" />
            <div className="h-4 w-full shimmer rounded" />
            <div className="h-4 w-2/3 shimmer rounded" />
          </div>
          <div className="h-12 shimmer rounded" />
          <div className="h-12 shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
