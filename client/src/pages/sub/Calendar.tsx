import { User } from '@/App';

export default function SubCalendar({ user }: { user: User }) {
  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '28px', marginBottom: '24px' }}>
        MY <span style={{ color: 'var(--amber)' }}>CALENDAR</span>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '40px', textAlign: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: '14px' }}>Calendar view coming soon</div>
      </div>
    </div>
  );
}
