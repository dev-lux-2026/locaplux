export default function KpiCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col gap-2">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
