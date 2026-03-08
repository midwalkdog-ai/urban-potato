import { useState } from 'react';
import { User } from '@/App';
import { generateMockUsers } from '@/lib/mockData';

export default function AdminUsers({ user }: { user: User }) {
  const [users] = useState(() => generateMockUsers(25));

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        SYSTEM <span style={{ color: 'var(--amber)' }}>USERS</span>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ padding: '18px' }}>
          {users.map(u => (
            <div key={u.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'var(--text)', fontWeight: 500 }}>{u.full_name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '11px' }}>{u.email}</div>
              </div>
              <span style={{ background: 'var(--blue)', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 600 }}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
