'use client';

import { useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: isDark ? '#333' : '#fff',
        color: isDark ? '#fff' : '#000',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
