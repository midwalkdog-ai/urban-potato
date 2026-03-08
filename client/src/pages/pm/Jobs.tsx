import { useState } from 'react';
import { User } from '@/App';
import { useData } from '@/contexts/DataContext';
import Modal from '@/components/Modal';
import { toast } from 'sonner';
import { Job } from '@/lib/mockData';

export default function PMJobs({ user }: { user: User }) {
  const { jobs, updateJobStatus, addInvoice } = useData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('');

  const handleUpdateJobStatus = (newStatus: Job['status']) => {
    if (selectedJob) {
      updateJobStatus(selectedJob.id, newStatus);
      toast.success(`Job updated to ${newStatus}`);
      setShowJobModal(false);
      setSelectedJob(null);
    }
  };

  const handleSubmitInvoice = () => {
    if (selectedJob && invoiceAmount) {
      addInvoice({
        id: `inv-${Date.now()}`,
        job_id: selectedJob.id,
        amount: parseFloat(invoiceAmount),
        status: 'submitted',
        created_at: new Date().toISOString(),
      });
      toast.success('Invoice submitted for review!');
      setShowInvoiceModal(false);
      setInvoiceAmount('');
      setSelectedJob(null);
    }
  };

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        MY <span style={{ color: 'var(--amber)' }}>JOBS</span>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
        {jobs.map(job => (
          <div key={job.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text)', fontWeight: 500 }}>{job.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '11px' }}>${job.amount}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ background: 'var(--amber)', color: '#000', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 600 }}>{job.status}</span>
              <button
                onClick={() => {
                  setSelectedJob(job);
                  setShowJobModal(true);
                }}
                style={{
                  background: 'var(--blue)',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showJobModal}
        onClose={() => {
          setShowJobModal(false);
          setSelectedJob(null);
        }}
        title={`Manage: ${selectedJob?.title}`}
        actions={
          <button
            onClick={() => {
              setShowJobModal(false);
              setShowInvoiceModal(true);
            }}
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
            Submit Invoice
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
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['assigned', 'in_progress', 'completed'] as const).map(status => (
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

      <Modal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setInvoiceAmount('');
        }}
        title="Submit Invoice"
        actions={
          <button
            onClick={handleSubmitInvoice}
            disabled={!invoiceAmount}
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
              cursor: invoiceAmount ? 'pointer' : 'not-allowed',
              opacity: invoiceAmount ? 1 : 0.5,
            }}
          >
            Submit
          </button>
        }
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Job</div>
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>{selectedJob?.title}</div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px', display: 'block' }}>Invoice Amount</label>
          <input
            type="number"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            placeholder="0.00"
            style={{
              width: '100%',
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '8px 12px',
              borderRadius: '3px',
              fontFamily: "'Barlow', sans-serif",
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
