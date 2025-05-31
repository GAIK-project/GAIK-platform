import React from 'react';

export interface ChartContainerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  className = '',
  loading = false
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
