import { useState } from 'react';
import { User } from '@/App';
import { toast } from 'sonner';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'homeowner' | 'property_manager' | 'subcontractor' | 'admin'>('homeowner');
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Email and password required');
      return;
    }

    setLoading(true);
    // Simulate login delay
    await new Promise(r => setTimeout(r, 800));

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: loginEmail,
      full_name: loginEmail.split('@')[0],
      role: selectedRole,
    };

    onLogin(user);
    toast.success('Logged in successfully!');
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      toast.error('Name, email and password required');
      return;
    }
    if (regPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    // Simulate registration delay
    await new Promise(r => setTimeout(r, 800));

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: regEmail,
      full_name: regName,
      role: selectedRole,
    };

    onLogin(user);
    toast.success('Account created successfully!');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'var(--bg)',
      backgroundImage: `
        radial-gradient(ellipse at 20% 50%, rgba(245,166,35,0.04) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(52,152,219,0.04) 0%, transparent 60%)
      `,
    }}>
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

      <div className="w-full max-w-md" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: '6px',
        padding: '36px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '36px',
            letterSpacing: '0.08em',
            marginBottom: '4px',
          }}>
            <span style={{ color: 'var(--amber)' }}>FLASH</span>
            <span style={{ color: 'var(--text)' }}>FIX</span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            Platform Dashboard
          </div>
        </div>

        {isLogin ? (
          // LOGIN FORM
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  background: 'var(--panel)',
                  border: '1px solid var(--border2)',
                  color: 'var(--text)',
                  padding: '9px 12px',
                  borderRadius: '3px',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--amber)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'var(--panel)',
                  border: '1px solid var(--border2)',
                  color: 'var(--text)',
                  padding: '9px 12px',
                  borderRadius: '3px',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--amber)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--amber)',
                color: '#000',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '3px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginBottom: '14px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
              No account?{' '}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setIsLogin(false); }}
                style={{ color: 'var(--amber)', textDecoration: 'none', cursor: 'pointer' }}
              >
                Register
              </a>
            </div>
          </form>
        ) : (
          // REGISTER FORM
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}>Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  background: 'var(--panel)',
                  border: '1px solid var(--border2)',
                  color: 'var(--text)',
                  padding: '9px 12px',
                  borderRadius: '3px',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--amber)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}>Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  background: 'var(--panel)',
                  border: '1px solid var(--border2)',
                  color: 'var(--text)',
                  padding: '9px 12px',
                  borderRadius: '3px',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--amber)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}>Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'var(--panel)',
                  border: '1px solid var(--border2)',
                  color: 'var(--text)',
                  padding: '9px 12px',
                  borderRadius: '3px',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--amber)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}>Phone (Optional)</label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                style={{
                  width: '100%',
                  background: 'var(--panel)',
                  border: '1px solid var(--border2)',
                  color: 'var(--text)',
                  padding: '9px 12px',
                  borderRadius: '3px',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--amber)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '8px',
              }}>Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['homeowner', 'property_manager', 'subcontractor'] as const).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    style={{
                      padding: '10px',
                      background: selectedRole === role ? 'var(--amber)' : 'var(--panel)',
                      color: selectedRole === role ? '#000' : 'var(--text)',
                      border: `1px solid ${selectedRole === role ? 'var(--amber)' : 'var(--border2)'}`,
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    {role === 'homeowner' ? 'Homeowner' : role === 'property_manager' ? 'PM' : 'Contractor'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--amber)',
                color: '#000',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '3px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginBottom: '14px',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
              Have an account?{' '}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setIsLogin(true); }}
                style={{ color: 'var(--amber)', textDecoration: 'none', cursor: 'pointer' }}
              >
                Sign in
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
