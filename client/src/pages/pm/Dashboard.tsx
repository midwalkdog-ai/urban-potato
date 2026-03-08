import { useState } from 'react';
import { User } from '@/App';
import { generateMockJobs, generateMockProperties, getStats } from '@/lib/mockData';

export default function PMDashboard({ user }: { user: User }) {
  const [jobs] = useState(() => generateMockJobs(20));
  const [properties] = useState(() => generateMockProperties(6));
  const stats = getStats(jobs, []);

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        PM <span style={{ color: 'var(--amber)' }}>DASHBOARD</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '22px' }}>
        {[
          { label: 'Properties', value: properties.length },
          { label: 'Active Jobs', value: stats.activeJobs },
          { label: 'Completed', value: stats.completedJobs },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--muted)', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '36px', color: 'var(--amber)' }}>{stat.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>Your Properties</div>
        {properties.map(prop => (
          <div key={prop.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ color: 'var(--text)' }}>{prop.address}</div>
            <span style={{ background: prop.status === 'active' ? 'var(--green)' : 'var(--muted)', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '9px' }}>{prop.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
