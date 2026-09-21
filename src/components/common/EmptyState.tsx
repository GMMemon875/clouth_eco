import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No products found',
  description = 'Try adjusting your filters, selecting another category, or clearing search keywords.',
  actionText = 'Browse All Collections',
  onAction,
  icon,
}) => {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400 shadow-inner">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <div>
        <h3 className="font-serif text-lg font-bold text-stone-900">{title}</h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-[#8b3a42] transition shadow"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
