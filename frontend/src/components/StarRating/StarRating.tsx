'use client';

import React from 'react';

interface StarRatingProps {
  value: number;
  max?: number;
  readonly?: boolean;
  onChange?: (stars: number) => void;
}

export function StarRating({ value, max = 5, readonly = true, onChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} de ${max} estrelas`}>
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const filled = starIndex <= Math.round(value);
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange && onChange(starIndex)}
            className={`text-xl leading-none transition-transform ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            style={{ color: filled ? '#C4894F' : '#D1B89A', background: 'none', border: 'none', padding: '0 1px' }}
            aria-label={`${starIndex} estrela${starIndex > 1 ? 's' : ''}`}
          >
            {filled ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
