import { useState } from 'react';
import { User } from '@/App';
import { generateMockProperties } from '@/lib/mockData';

export default function PMProperties({ user }: { user: User }) {
  const [properties] = useState(() => generateMockProperties(12));

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        MY <span style={{ color: 'var(--amber)' }}>PROPERTIES</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {properties.map(prop => (
          <div key={prop.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
            <div style={{ color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>{prop.address}</div>
            <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '12px' }}>{prop.city}</div>
            <button style={{ background: 'var(--amber)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
