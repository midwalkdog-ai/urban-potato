import { useState } from 'react';
import { User } from '@/App';
import AdminDashboard from './admin/Dashboard';
import AdminJobs from './admin/Jobs';
import AdminPayments from './admin/Payments';
import AdminUsers from './admin/Users';
import PMDashboard from './pm/Dashboard';
import PMProperties from './pm/Properties';
import PMJobs from './pm/Jobs';
import PMInvoices from './pm/Invoices';
import SubDashboard from './sub/Dashboard';
import SubAvailable from './sub/Available';
import SubMyJobs from './sub/MyJobs';
import SubCalendar from './sub/Calendar';
import OwnerDashboard from './owner/Dashboard';
import OwnerJobs from './owner/Jobs';
import NotificationCenter from '@/components/NotificationCenter';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type PageType = 
  | 'admin-dashboard' | 'admin-jobs' | 'admin-payments' | 'admin-users'
  | 'pm-dashboard' | 'pm-properties' | 'pm-jobs' | 'pm-invoices'
  | 'sub-dashboard' | 'sub-available' | 'sub-myjobs' | 'sub-calendar'
  | 'owner-dashboard' | 'owner-jobs';

const NAV_ITEMS = {
  admin: [
    { section: 'Overview', items: [
      { icon: '◈', label: 'Dashboard', page: 'admin-dashboard' as PageType },
    ]},
    { section: 'Operations', items: [
      { icon: '⊞', label: 'All Jobs', page: 'admin-jobs' as PageType },
      { icon: '⊗', label: 'Payments', page: 'admin-payments' as PageType },
    ]},
    { section: 'Users', items: [
      { icon: '◐', label: 'Users', page: 'admin-users' as PageType },
    ]},
  ],
  property_manager: [
    { section: 'Overview', items: [
      { icon: '◈', label: 'Dashboard', page: 'pm-dashboard' as PageType },
    ]},
    { section: 'Work', items: [
      { icon: '◉', label: 'Properties', page: 'pm-properties' as PageType },
      { icon: '⊞', label: 'Jobs', page: 'pm-jobs' as PageType },
    ]},
    { section: 'Finance', items: [
      { icon: '⊗', label: 'Invoices', page: 'pm-invoices' as PageType },
    ]},
  ],
  subcontractor: [
    { section: 'Overview', items: [
      { icon: '◈', label: 'Dashboard', page: 'sub-dashboard' as PageType },
    ]},
    { section: 'Jobs', items: [
      { icon: '⊕', label: 'Find Jobs', page: 'sub-available' as PageType },
      { icon: '⊞', label: 'My Jobs', page: 'sub-myjobs' as PageType },
      { icon: '◐', label: 'Calendar', page: 'sub-calendar' as PageType },
    ]},
  ],
  homeowner: [
    { section: 'Overview', items: [
      { icon: '◈', label: 'Dashboard', page: 'owner-dashboard' as PageType },
    ]},
    { section: 'Services', items: [
      { icon: '⊞', label: 'My Jobs', page: 'owner-jobs' as PageType },
    ]},
  ],
};

const defaultPages = {
  admin: 'admin-dashboard' as PageType,
  property_manager: 'pm-dashboard' as PageType,
  subcontractor: 'sub-dashboard' as PageType,
  homeowner: 'owner-dashboard' as PageType,
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<PageType>(defaultPages[user.role]);

  const navItems = NAV_ITEMS[user.role] || [];

  const renderPage = () => {
    const pageProps = { user };
    
    switch (currentPage) {
      case 'admin-dashboard': return <AdminDashboard {...pageProps} />;
      case 'admin-jobs': return <AdminJobs {...pageProps} />;
      case 'admin-payments': return <AdminPayments {...pageProps} />;
      case 'admin-users': return <AdminUsers {...pageProps} />;
      case 'pm-dashboard': return <PMDashboard {...pageProps} />;
      case 'pm-properties': return <PMProperties {...pageProps} />;
      case 'pm-jobs': return <PMJobs {...pageProps} />;
      case 'pm-invoices': return <PMInvoices {...pageProps} />;
      case 'sub-dashboard': return <SubDashboard {...pageProps} />;
      case 'sub-available': return <SubAvailable {...pageProps} />;
      case 'sub-myjobs': return <SubMyJobs {...pageProps} />;
      case 'sub-calendar': return <SubCalendar {...pageProps} />;
      case 'owner-dashboard': return <OwnerDashboard {...pageProps} />;
      case 'owner-jobs': return <OwnerJobs {...pageProps} />;
      default: return <div>Page not found</div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <style>{`
        :root {
          --bg:       #0c0e11;
          --surface:  #13171c;
          --panel:    #1a1f26;
          --card:     #1e242c;
          --border:   #252d37;
          --border2:  #2f3a47;
          --amber:    #f5a623;
          --amber-dk: #c4831a;
          --amber-lt: #ffd166;
          --green:    #2ecc71;
          --green-dk: #27ae60;
          --red:      #e74c3c;
          --blue:     #3498db;
          --purple:   #9b59b6;
          --text:     #dde4ec;
          --muted:    #6b7c8d;
          --faint:    #323d4a;
        }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: '210px',
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        transition: 'width 0.2s',
      }}>
        {/* Brand */}
        <div style={{
          padding: '18px 16px 14px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '22px',
            letterSpacing: '0.06em',
          }}>
            <span style={{ color: 'var(--amber)' }}>FF</span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
            marginTop: '4px',
          }}>
            {user.role === 'admin' ? 'Admin' : user.role === 'property_manager' ? 'Property Manager' : user.role === 'subcontractor' ? 'Subcontractor' : 'Homeowner'}
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text)',
            marginTop: '2px',
          }}>
            {user.full_name}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--muted)',
          }}>
            {user.email}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {navItems.map((section, idx) => (
            <div key={idx}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--faint)',
                padding: '10px 16px 4px',
              }}>
                {section.section}
              </div>
              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  onClick={() => setCurrentPage(item.page)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '8px 16px',
                    color: currentPage === item.page ? 'var(--amber)' : 'var(--muted)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderLeft: currentPage === item.page ? '2px solid var(--amber)' : '2px solid transparent',
                    transition: 'all 0.12s',
                    background: currentPage === item.page ? 'var(--panel)' : 'transparent',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== item.page) {
                      e.currentTarget.style.background = 'var(--panel)';
                      e.currentTarget.style.color = 'var(--text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== item.page) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--muted)';
                    }
                  }}
                >
                  <span style={{ fontSize: '14px', width: '16px', textAlign: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
        }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--muted)',
              border: '1px solid var(--border2)',
              padding: '5px 12px',
              borderRadius: '3px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.background = 'var(--panel)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Sign Out
          </button>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            color: 'var(--faint)',
            textAlign: 'center',
            marginTop: '8px',
          }}>
            FlashFix v1.0
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}>
        {/* Header with Notifications */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '12px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}>
          <NotificationCenter />
        </div>
        {/* Page Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px',
        }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
