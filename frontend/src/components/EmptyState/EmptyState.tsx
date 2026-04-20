import React from 'react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      {icon && (
        <div className="text-5xl" style={{ color: 'var(--color-muted)' }}>
          {icon}
        </div>
      )}
      <p className="text-base" style={{ color: 'var(--color-muted)' }}>
        {message}
      </p>
    </div>
  );
}

export default EmptyState;
