import { useState } from 'react';
import { User } from '@/App';
import { generateMockJobs, getStats } from '@/lib/mockData';

export default function OwnerDashboard({ user }: { user: User }) {
  const [jobs] = useState(() => generateMockJobs(8));
  const stats = getStats(jobs, []);

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        HOME <span style={{ color: 'var(--amber)' }}>DASHBOARD</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '22px' }}>
        {[
          { label: 'Active Jobs', value: stats.activeJobs },
          { label: 'Completed', value: stats.completedJobs },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--muted)', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '36px', color: 'var(--blue)' }}>{stat.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>Recent Jobs</div>
        {jobs.slice(0, 4).map(job => (
          <div key={job.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ color: 'var(--text)' }}>{job.title}</div>
            <span style={{ background: 'var(--blue)', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '9px' }}>{job.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
