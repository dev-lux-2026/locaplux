import { Skeleton } from "@/components/ui/skeleton";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";

export default function CategoryPageSkeleton() {
  return (
    <div className="py-10 space-y-10">

      {/* HEADER */}
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-1/3 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>

      {/* GRID PRODUITS */}
      <ProductGridSkeleton />
    </div>
  );
}
