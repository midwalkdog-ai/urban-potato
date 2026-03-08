import { useState } from 'react';
import { User } from '@/App';
import { generateMockJobs } from '@/lib/mockData';

export default function AdminJobs({ user }: { user: User }) {
  const [jobs] = useState(() => generateMockJobs(50));

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        ALL <span style={{ color: 'var(--amber)' }}>JOBS</span>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ padding: '18px' }}>
          {jobs.map(job => (
            <div key={job.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'var(--text)', fontWeight: 500 }}>{job.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: '11px' }}>{job.property}</div>
              </div>
              <span style={{ background: 'var(--amber)', color: '#000', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 600 }}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
