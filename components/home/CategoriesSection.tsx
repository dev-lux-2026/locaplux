"use client";

import Link from "next/link";

export default function CategoriesSection({ categories = [] }) {
  return (
    <div
      className="
        grid 
        grid-cols-3 
        sm:grid-cols-4 
        md:grid-cols-6 
        lg:grid-cols-8 
        xl:grid-cols-10 
        gap-3
      "
    >
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.id}`}
          className="
            flex flex-col items-center p-2 rounded-lg
            bg-white dark:bg-[#18181A]
            border border-gray-200 dark:border-white/10
            hover:shadow-md transition
          "
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="
              object-cover rounded-md
              w-14 h-14
              sm:w-16 sm:h-16
              md:w-20 md:h-20
            "
          />

          <p className="text-xs mt-2 text-gray-700 dark:text-gray-300 text-center">
            {cat.name}
          </p>
        </Link>
      ))}
    </div>
  );
}
