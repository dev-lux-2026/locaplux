import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F0F10] shadow-sm">
      {/* IMAGE */}
      <Skeleton className="w-full h-48" />

      <div className="p-4 space-y-3">
        {/* TITRE */}
        <Skeleton className="h-5 w-3/4" />

        {/* PRIX */}
        <Skeleton className="h-4 w-1/3" />

        {/* BOUTON */}
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
