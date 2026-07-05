"use client";

import { useEffect, useRef } from "react";
import Sortable from "sortablejs";

export default function ImageReorder({
  images,
  onReorder,
}: {
  images: string[];
  onReorder: (newOrder: string[]) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;

    const sortable = Sortable.create(listRef.current, {
      animation: 150,
      easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      ghostClass: "opacity-40",
      dragClass: "scale-95",
      onEnd: (evt) => {
        const newOrder = [...images];
        const [moved] = newOrder.splice(evt.oldIndex!, 1);
        newOrder.splice(evt.newIndex!, 0, moved);
        onReorder(newOrder);
      },
    });

    return () => sortable.destroy();
  }, [images, onReorder]);

  return (
    <div
      ref={listRef}
      className="grid grid-cols-3 sm:grid-cols-4 gap-3"
    >
      {images.map((url, i) => (
        <div
          key={url}
          className="relative group cursor-grab active:cursor-grabbing"
        >
          <img
            src={url}
            className="w-full h-28 object-cover rounded-xl border border-gray-200 dark:border-white/10 shadow-sm transition-all"
          />

          <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
