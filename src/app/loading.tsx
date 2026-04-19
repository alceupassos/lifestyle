import { ProductGridSkeleton } from '@/components/ui/Skeletons';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div className="h-8 w-48 shimmer rounded mb-4" />
      <div className="h-12 w-72 shimmer rounded mb-12" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
