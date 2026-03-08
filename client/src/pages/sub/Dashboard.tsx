import { useState } from 'react';
import { User } from '@/App';
import { generateMockJobs, getStats } from '@/lib/mockData';

export default function SubDashboard({ user }: { user: User }) {
  const [jobs] = useState(() => generateMockJobs(15));
  const stats = getStats(jobs, []);

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        CONTRACTOR <span style={{ color: 'var(--amber)' }}>DASHBOARD</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '22px' }}>
        {[
          { label: 'Available Jobs', value: jobs.filter(j => j.status === 'pending').length },
          { label: 'My Jobs', value: stats.activeJobs },
          { label: 'Completed', value: stats.completedJobs },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--muted)', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '36px', color: 'var(--green)' }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
