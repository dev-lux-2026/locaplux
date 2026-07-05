import { Skeleton } from "@/components/ui/skeleton";

export default function PartnerSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C]">
      {/* BANNIÈRE */}
      <Skeleton className="w-full h-56 md:h-72" />

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 pb-16 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end gap-6">
          {/* AVATAR */}
          <Skeleton className="w-28 h-28 rounded-2xl" />

          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-8">
          {/* COLONNE GAUCHE */}
          <div className="space-y-6">

            {/* À PROPOS */}
            <div className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* HISTOGRAMME PREMIUM */}
            <div className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
              <Skeleton className="h-6 w-40" />

              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-6 h-4" />
                  <Skeleton className="flex-1 h-2" />
                  <Skeleton className="w-10 h-4" />
                </div>
              ))}
            </div>

            {/* LISTE DES AVIS */}
            <div className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
              <Skeleton className="h-6 w-32" />

              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-white/10 rounded-xl p-4 space-y-3"
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>

          {/* COLONNE DROITE */}
          <aside className="space-y-6">
            <div className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-5 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
