'use client';

import { Info } from 'lucide-react';

export default function InfoBox() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#f0f4ff',
          borderRadius: '12px',
          padding: '20px 30px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Info size={32} style={{ marginRight: '16px', color: '#3366ff' }} />

        <p style={{ fontSize: '16px', color: '#333', margin: 0 }}>
          Please note that the data sent here is sent to{' '}
          <a href="https://www.llamaindex.ai/llamaparse" style={{ color: '#3366ff', textDecoration: 'underline' }}>
            Llamaparse
          </a>
          {' '}for parsing, to{' '}
          <a href="https://platform.openai.com/docs/overview" style={{ color: '#3366ff', textDecoration: 'underline' }}>
            OpenAI API
          </a>
          {' '}to create embeddingdata, and stored in{' '}
          <a href="https://supabase.com/" style={{ color: '#3366ff', textDecoration: 'underline' }}>
            Supabase
          </a>
          .
        </p>
      </div>
    </div>
  );
}
