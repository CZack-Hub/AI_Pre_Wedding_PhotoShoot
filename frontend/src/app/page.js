'use client';

import { useState } from 'react';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#0a0a0a',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>
        AI-Powered Virtual Pre-Wedding Studio
      </h1>
      <p style={{ color: '#a0a0a0', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6', marginBottom: '2rem' }}>
        Start building your custom pre-wedding studio dashboard, photo upload interfaces, and AI pipeline integrations here.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          background: '#ffffff',
          color: '#000000',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </div>
    </main>
  );
}
