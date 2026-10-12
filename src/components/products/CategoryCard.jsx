import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden block shadow-soft-sm hover:shadow-soft transition-all duration-500"
    >
      {/* Background Image */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent transition-opacity group-hover:opacity-90" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-300">
              {category.itemCount} Curated Pieces
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-white group-hover:text-brand-200 transition-colors">
              {category.name}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-brand-600 transition-colors shrink-0">
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
        <p className="text-xs text-stone-300 mt-2 line-clamp-2 opacity-90 font-light">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
