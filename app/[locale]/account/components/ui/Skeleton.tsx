type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg
        ${className || ""}
      `}
    />
  );
}
