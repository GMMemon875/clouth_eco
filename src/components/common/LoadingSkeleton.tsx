import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-[3/4] bg-stone-200 w-full" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 bg-stone-200 rounded w-1/3" />
          <div className="h-4 bg-stone-200 rounded w-4/5" />
          <div className="h-3 bg-stone-200 rounded w-1/2" />
        </div>
        <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
          <div className="h-5 bg-stone-200 rounded w-1/3" />
          <div className="h-4 bg-stone-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
