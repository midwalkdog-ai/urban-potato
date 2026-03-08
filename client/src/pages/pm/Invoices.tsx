import { useState } from 'react';
import { User } from '@/App';
import { generateMockInvoices } from '@/lib/mockData';

export default function PMInvoices({ user }: { user: User }) {
  const [invoices] = useState(() => generateMockInvoices(15));

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        MY <span style={{ color: 'var(--amber)' }}>INVOICES</span>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '18px' }}>
        {invoices.map(inv => (
          <div key={inv.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--text)', fontWeight: 500 }}>${inv.amount}</div>
              <div style={{ color: 'var(--muted)', fontSize: '11px' }}>{inv.id}</div>
            </div>
            <span style={{ background: inv.status === 'paid' ? 'var(--green)' : 'var(--amber)', color: inv.status === 'paid' ? '#fff' : '#000', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 600 }}>{inv.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
