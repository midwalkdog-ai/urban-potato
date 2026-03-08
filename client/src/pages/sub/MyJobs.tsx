import { useState } from 'react';
import { User } from '@/App';
import { useData } from '@/contexts/DataContext';
import Modal from '@/components/Modal';
import { toast } from 'sonner';
import { Job } from '@/lib/mockData';

export default function SubMyJobs({ user }: { user: User }) {
  const { jobs, updateJobStatus } = useData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);

  const myJobs = jobs.filter(j => j.status !== 'pending');

  const handleUpdateStatus = (newStatus: Job['status']) => {
    if (selectedJob) {
      updateJobStatus(selectedJob.id, newStatus);
      toast.success(`Job marked as ${newStatus}`);
      setShowModal(false);
      setSelectedJob(null);
    }
  };

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        MY <span style={{ color: 'var(--amber)' }}>JOBS</span>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
        {myJobs.map(job => (
          <div
            key={job.id}
            onClick={() => {
              setSelectedJob(job);
              setShowModal(true);
            }}
            style={{
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <div>
              <div style={{ color: 'var(--text)', fontWeight: 500 }}>{job.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '11px' }}>{job.property}</div>
            </div>
            <span style={{
              background: job.status === 'completed' ? 'var(--green)' : 'var(--blue)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}>
              {job.status}
            </span>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedJob(null);
        }}
        title={`Update: ${selectedJob?.title}`}
        actions={
          <button
            onClick={() => handleUpdateStatus('completed')}
            style={{
              background: 'var(--green)',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '3px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Mark Complete
          </button>
        }
      >
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Current Status</div>
          <div style={{ color: 'var(--text)', fontWeight: 500, textTransform: 'capitalize' }}>{selectedJob?.status}</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Property</div>
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>{selectedJob?.property}</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Amount</div>
          <div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '16px' }}>${selectedJob?.amount}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['assigned', 'in_progress', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => handleUpdateStatus(status)}
              style={{
                flex: 1,
                background: selectedJob?.status === status ? 'var(--green)' : 'var(--panel)',
                color: selectedJob?.status === status ? '#fff' : 'var(--text)',
                border: `1px solid ${selectedJob?.status === status ? 'var(--green)' : 'var(--border)'}`,
                padding: '6px 8px',
                borderRadius: '3px',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
