import { useState, useMemo } from 'react';
import { User } from '@/App';
import { useData } from '@/contexts/DataContext';
import { getStats, Job } from '@/lib/mockData';
import Modal from '@/components/Modal';
import { toast } from 'sonner';

interface PageProps {
  user: User;
}

export default function AdminDashboard({ user }: PageProps) {
  const { jobs, invoices } = useData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const { updateJobStatus } = useData();

  const stats = useMemo(() => getStats(jobs, invoices), [jobs, invoices]);
  const recentJobs = useMemo(() => jobs.slice(0, 6), [jobs]);
  const recentInvoices = useMemo(() => invoices.slice(0, 5), [invoices]);

  const handleUpdateJobStatus = (newStatus: Job['status']) => {
    if (selectedJob) {
      updateJobStatus(selectedJob.id, newStatus);
      toast.success(`Job updated to ${newStatus}`);
      setShowJobModal(false);
      setSelectedJob(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '28px',
            letterSpacing: '0.04em',
            color: 'var(--text)',
            lineHeight: 1,
          }}>
            ADMIN <span style={{ color: 'var(--amber)' }}>DASHBOARD</span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--muted)',
            marginTop: '6px',
          }}>
            // system overview · all users · all jobs
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: 'var(--green)',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
          }}></span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: 'var(--muted)',
          }}>Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '22px',
      }}>
        {[
          { label: 'Total Jobs', value: stats.totalJobs, color: 'blue' },
          { label: 'Active Jobs', value: stats.activeJobs, color: 'green' },
          { label: 'Completed', value: stats.completedJobs, color: 'amber' },
          { label: 'Payments Awaiting', value: stats.pendingPayments, color: 'red' },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `var(--${stat.color})`,
            }}></div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '8px',
            }}>
              {stat.label}
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '36px',
              lineHeight: 1,
              color: `var(--${stat.color})`,
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs & Invoices */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '12px',
      }}>
        {/* Recent Jobs */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '13px 18px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text)',
            }}>
              Recent Jobs
            </div>
          </div>
          <div style={{ padding: '18px' }}>
            {recentJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJob(job);
                  setShowJobModal(true);
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '12px',
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
                  background: job.status === 'completed' ? 'var(--green)' : job.status === 'in_progress' ? 'var(--blue)' : 'var(--amber)',
                  color: job.status === 'completed' || job.status === 'in_progress' ? '#fff' : '#000',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '13px 18px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text)',
            }}>
              Recent Invoices
            </div>
          </div>
          <div style={{ padding: '18px' }}>
            {recentInvoices.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '12px',
                }}
              >
                <div>
                  <div style={{ color: 'var(--text)', fontWeight: 500 }}>${inv.amount}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '10px' }}>{inv.id}</div>
                </div>
                <span style={{
                  background: inv.status === 'paid' ? 'var(--green)' : 'var(--amber)',
                  color: inv.status === 'paid' ? '#fff' : '#000',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Status Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={() => {
          setShowJobModal(false);
          setSelectedJob(null);
        }}
        title={`Update Job: ${selectedJob?.title}`}
        actions={
          <button
            onClick={() => handleUpdateJobStatus('completed')}
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
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>{selectedJob?.status}</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Property</div>
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>{selectedJob?.property}</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Amount</div>
          <div style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '16px' }}>${selectedJob?.amount}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {(['pending', 'assigned', 'in_progress', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => handleUpdateJobStatus(status)}
              style={{
                flex: 1,
                background: selectedJob?.status === status ? 'var(--amber)' : 'var(--panel)',
                color: selectedJob?.status === status ? '#000' : 'var(--text)',
                border: `1px solid ${selectedJob?.status === status ? 'var(--amber)' : 'var(--border)'}`,
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
