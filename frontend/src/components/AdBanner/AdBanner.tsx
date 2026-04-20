'use client';

import React from 'react';

export function AdBanner() {
  return (
    <div
      className="ad-banner"
      style={{
        minHeight: 90,
        background: 'var(--color-parchment)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed var(--color-muted)',
        borderRadius: 4,
        margin: '16px 0',
      }}
    >
      <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>Advertisement</span>
    </div>
  );
}

export default AdBanner;
