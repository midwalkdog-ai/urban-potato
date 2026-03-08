import { useState } from 'react';
import { User } from '@/App';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

export default function SubAvailable({ user }: { user: User }) {
  const { jobs, updateJobStatus } = useData();
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);

  const availableJobs = jobs.filter(j => j.status === 'pending' && !acceptedJobs.includes(j.id));

  const handleAcceptJob = (jobId: string) => {
    updateJobStatus(jobId, 'assigned');
    setAcceptedJobs(prev => [...prev, jobId]);
    toast.success('Job accepted! Check your My Jobs tab.');
  };

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        FIND <span style={{ color: 'var(--amber)' }}>JOBS</span>
      </div>
      
      {availableJobs.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '40px', textAlign: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: '14px' }}>No available jobs at the moment</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {availableJobs.map(job => (
            <div key={job.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
              <div style={{ color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>{job.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '8px' }}>{job.property}</div>
              <div style={{ color: 'var(--amber)', fontWeight: 600, marginBottom: '12px', fontSize: '16px' }}>${job.amount}</div>
              <button
                onClick={() => handleAcceptJob(job.id)}
                style={{
                  background: 'var(--green)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  width: '100%',
                }}
              >
                Accept Job
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
