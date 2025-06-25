import { cn } from '@/lib/utils';

interface AdPlaceholderProps {
  type: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function AdPlaceholder({ type, className, size = 'medium' }: AdPlaceholderProps) {
  const sizeClasses = {
    small: 'h-20',
    medium: 'h-32',
    large: 'h-48'
  };

  return (
    <div className={cn(
      'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 rounded-lg p-4 text-center flex flex-col justify-center items-center',
      sizeClasses[size],
      className
    )}>
      <div className="text-sm text-gray-600 mb-1 font-medium">Advertisement</div>
      <div className="text-xs text-gray-500">{type} Ad Placement</div>
      <div className="text-xs text-gray-400 mt-1">Google AdSense Ready</div>
      <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
        {size === 'large' ? '728x90' : size === 'medium' ? '300x250' : '320x50'}
      </div>
    </div>
  );
}