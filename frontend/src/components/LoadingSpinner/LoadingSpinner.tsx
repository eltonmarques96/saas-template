import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
}

export function LoadingSpinner({ size = 40 }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: size + 16 }}>
      <div
        style={{
          width: size,
          height: size,
          border: `4px solid var(--color-parchment)`,
          borderTopColor: 'var(--color-mahogany)',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default LoadingSpinner;
