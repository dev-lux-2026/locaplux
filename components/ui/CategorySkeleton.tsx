import Skeleton from "@/components/ui/Skeleton";

export default function CategorySkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 shadow-sm">
      <Skeleton className="w-14 h-14 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
