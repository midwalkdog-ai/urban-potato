import { useState } from 'react';
import { User } from '@/App';
import { useData } from '@/contexts/DataContext';
import Modal from '@/components/Modal';
import { toast } from 'sonner';

interface InvoiceDetail {
  id: string;
  amount: number;
  status: 'draft' | 'submitted' | 'payment_declared' | 'paid';
  job_id: string;
  created_at: string;
}

export default function AdminPayments({ user }: { user: User }) {
  const { invoices, updateInvoiceStatus } = useData();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInvoices = filterStatus === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filterStatus);

  const handleApprovePayment = () => {
    if (selectedInvoice) {
      updateInvoiceStatus(selectedInvoice.id, 'paid');
      toast.success('Payment approved!');
      setShowModal(false);
      setSelectedInvoice(null);
    }
  };

  const handleRejectPayment = () => {
    if (selectedInvoice) {
      updateInvoiceStatus(selectedInvoice.id, 'submitted');
      toast.info('Invoice returned to submitted');
      setShowModal(false);
      setSelectedInvoice(null);
    }
  };

  const stats = {
    total: invoices.length,
    pending: invoices.filter(i => i.status === 'payment_declared').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    revenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <div>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: '28px',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ color: 'var(--amber)' }}>PAYMENTS</span>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '22px',
      }}>
        {[
          { label: 'Total Invoices', value: stats.total, color: 'blue' },
          { label: 'Pending Approval', value: stats.pending, color: 'amber' },
          { label: 'Paid', value: stats.paid, color: 'green' },
          { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, color: 'green' },
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '18px',
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              color: 'var(--muted)',
              marginBottom: '8px',
            }}>
              {stat.label}
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '28px',
              color: `var(--${stat.color})`,
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {['all', 'draft', 'submitted', 'payment_declared', 'paid'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              background: filterStatus === status ? 'var(--amber)' : 'var(--panel)',
              color: filterStatus === status ? '#000' : 'var(--text)',
              border: `1px solid ${filterStatus === status ? 'var(--amber)' : 'var(--border)'}`,
              padding: '6px 12px',
              borderRadius: '3px',
              fontFamily: "'Barlow', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {status === 'payment_declared' ? 'Awaiting Payment' : status}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
          gap: '12px',
          padding: '13px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--panel)',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '11px',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          <div>Invoice ID</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Created</div>
          <div>Action</div>
        </div>
        <div style={{ padding: '18px' }}>
          {filteredInvoices.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px' }}>
              No invoices found
            </div>
          ) : (
            filteredInvoices.map(inv => (
              <div
                key={inv.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'center',
                }}
              >
                <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: '12px' }}>
                  {inv.id}
                </div>
                <div style={{ color: 'var(--amber)', fontWeight: 600 }}>
                  ${inv.amount}
                </div>
                <div>
                  <span style={{
                    background: inv.status === 'paid' ? 'var(--green)' : inv.status === 'payment_declared' ? 'var(--red)' : 'var(--blue)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}>
                    {inv.status === 'payment_declared' ? 'Awaiting' : inv.status}
                  </span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '11px' }}>
                  {new Date(inv.created_at).toLocaleDateString()}
                </div>
                <button
                  onClick={() => {
                    setSelectedInvoice(inv);
                    setShowModal(true);
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
                  Review
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedInvoice(null);
        }}
        title={`Invoice ${selectedInvoice?.id}`}
        actions={
          <>
            {selectedInvoice?.status === 'payment_declared' && (
              <>
                <button
                  onClick={handleRejectPayment}
                  style={{
                    background: 'transparent',
                    color: 'var(--red)',
                    border: '1px solid var(--red)',
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
                  Reject
                </button>
                <button
                  onClick={handleApprovePayment}
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
                  Approve Payment
                </button>
              </>
            )}
          </>
        }
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Amount</div>
          <div style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '24px' }}>
            ${selectedInvoice?.amount}
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Status</div>
          <div style={{ color: 'var(--text)', fontWeight: 500, textTransform: 'capitalize' }}>
            {selectedInvoice?.status === 'payment_declared' ? 'Awaiting Payment' : selectedInvoice?.status}
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Job ID</div>
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>{selectedInvoice?.job_id}</div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Created</div>
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>
            {selectedInvoice && new Date(selectedInvoice.created_at).toLocaleString()}
          </div>
        </div>
      </Modal>
    </div>
  );
}
