import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/AuthContext.jsx';
import './Admin.css';

/* ── Stat card ─────────────────────────────────────────────────── */
function StatCard({ label, value, icon, sub }) {
  return (
    <div className="admin-stat card">
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div className="admin-stat__val">{value}</div>
      <div className="admin-stat__label">{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'rgba(245,239,224,0.35)', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

/* ── Status badge ───────────────────────────────────────────────── */
function Badge({ status }) {
  const map = {
    pending:   { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Pending' },
    confirmed: { bg: 'rgba(34,197,94,0.15)',  color: '#22c55e', label: 'Confirmed' },
    completed: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: 'Completed' },
    cancelled: { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', label: 'Cancelled' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em'
    }}>{s.label}</span>
  );
}

/* ── Main Admin component ───────────────────────────────────────── */
const ADMIN_EMAILS = [
  'admin@gmail.com',
  'akshatsaxena.work@gmail.com'
];

export default function Admin() {
  const { user, loading: authLoading, dataVersion, signOut } = useAuth();
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [err,         setErr]         = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data
  const [predictions, setPredictions] = useState([]);
  const [bookings,    setBookings]    = useState([]);
  const [tab,         setTab]         = useState('overview'); // 'overview' | 'predictions' | 'bookings'
  const [dataLoading, setDataLoading] = useState(false);

  /* ── Load data when authed ─ */
  const loadData = useCallback(async () => {
    setDataLoading(true);
    const [predsRes, booksRes] = await Promise.all([
      supabase.from('free_predictions').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    ]);
    if (predsRes.error) console.error('Error loading predictions:', predsRes.error);
    if (booksRes.error) console.error('Error loading bookings:', booksRes.error);
    setPredictions(predsRes.data || []);
    setBookings(booksRes.data || []);
    setDataLoading(false);
  }, []);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, loadData, dataVersion]);

  /* ── Login ─ */
  const login = async (e) => {
    e.preventDefault();
    setLoginLoading(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    setLoginLoading(false);
  };

  /* ════════════════════════════════════
     LOADING STATE
  ════════════════════════════════════ */
  if (authLoading) {
    return <div className="admin-login"><p>Verifying access...</p></div>;
  }

  /* ════════════════════════════════════
     LOGIN SCREEN
  ════════════════════════════════════ */
  if (!user) {
    return (
      <div className="admin-login">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>☽</div>
          <h2 className="admin-login__title">Admin Portal</h2>
          <p style={{ fontSize: '13px', color: 'rgba(245,239,224,0.4)', marginTop: '4px' }}>
            Cosmic Destiny Dashboard
          </p>
        </div>
        <form className="admin-login__form card" onSubmit={login}>
          <div className="form-group">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com" autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-pw">Password</label>
            <input
              id="admin-pw" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password"
            />
          </div>
          {err && <p className="admin-login__err">⚠ {err}</p>}
          <button
            type="submit"
            className="btn-gold btn-gold-filled"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loginLoading}
          >
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
          <a href="/" className="btn-gold btn-gold-outline" style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '10px', textDecoration: 'none' }}>
            ← Back to Site
          </a>
        </form>
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(245,239,224,0.25)', marginTop: '16px' }}>
          Access restricted to authorised users only
        </p>
      </div>
    );
  }

  /* ════════════════════════════════════
     ACCESS DENIED (If logged in but not admin)
  ════════════════════════════════════ */
  if (!isAdmin) {
    return (
      <div className="admin-login">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>⚠ Access Denied</h2>
          <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.6)', marginBottom: '2rem' }}>
            Your account ({user.email}) does not have administrator privileges.
          </p>
          <button onClick={() => signOut()} className="btn-gold btn-gold-outline" style={{ width: '100%' }}>
            Sign Out & Try Another Account
          </button>
          <a href="/" style={{ display: 'block', marginTop: '1rem', color: '#c9a14a', fontSize: '13px' }}>
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  /* ── Update booking status ─ */
  const updateStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    loadData();
  };

  // ── Computed stats ───
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.amount || 0), 0);
  const pending      = bookings.filter(b => b.status === 'pending').length;
  const confirmed    = bookings.filter(b => b.status === 'confirmed').length;
  const todayPreds   = predictions.filter(p => p.created_at?.startsWith(new Date().toISOString().slice(0, 10))).length;

  /* ════════════════════════════════════
     DASHBOARD
  ════════════════════════════════════ */
  return (
    <div className="admin-dash">
      <div className="container">

        {/* Header */}
        <div className="admin-dash__header">
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '4px' }}>
              ☽ Dashboard
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.35)', letterSpacing: '0.05em' }}>
              COSMIC DESTINY ADMIN
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a
              href="/"
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,161,74,0.4)',
                color: '#c9a14a',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ← Back to Site
            </a>
            <button
              onClick={loadData}
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,161,74,0.4)',
                color: '#c9a14a',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ↺ Refresh
            </button>
            <button
              onClick={signOut}
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,161,74,0.4)',
                color: '#c9a14a',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="admin-dash__stats">
          <StatCard icon="🔮" label="Total Free Predictions" value={predictions.length} sub={`${todayPreds} today`} />
          <StatCard icon="📅" label="Total Bookings"         value={bookings.length}    sub={`${pending} pending`} />
          <StatCard icon="✅" label="Confirmed Sessions"     value={confirmed} />
          <StatCard icon="₹"  label="Revenue Collected"      value={`₹${totalRevenue.toLocaleString('en-IN')}`} sub="completed only" />
        </div>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(201,161,74,0.15)', paddingBottom: '12px' }}>
          {['overview', 'predictions', 'bookings'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? 'rgba(201,161,74,0.15)' : 'transparent',
                border: tab === t ? '1px solid rgba(201,161,74,0.4)' : '1px solid transparent',
                color: tab === t ? '#c9a14a' : 'rgba(245,239,224,0.5)',
                borderRadius: '8px', padding: '7px 18px',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                textTransform: 'capitalize', letterSpacing: '0.04em'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {dataLoading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(245,239,224,0.4)' }}>
            Loading data…
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {!dataLoading && tab === 'overview' && (
          <div className="admin-dash__grid">

            {/* Recent Predictions */}
            <div className="card">
              <h3 className="admin-card__title">🔮 Recent Free Predictions</h3>
              {predictions.length === 0
                ? <p className="admin-empty">No predictions yet.</p>
                : predictions.slice(0, 6).map(p => (
                  <div key={p.id} className="admin-row">
                    <div>
                      <strong>{p.name}</strong>
                      <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.45)', marginTop: '2px' }}>
                        {p.zodiac_sign} · {p.place} · {p.gender}
                      </p>
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(245,239,224,0.3)' }}>
                      {new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                ))
              }
            </div>

            {/* Upcoming Bookings */}
            <div className="card">
              <h3 className="admin-card__title">📅 Recent Bookings</h3>
              {bookings.length === 0
                ? <p className="admin-empty">No bookings yet.</p>
                : bookings.slice(0, 6).map(b => (
                  <div key={b.id} className="admin-row">
                    <div>
                      <strong>{b.name}</strong>
                      <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.45)', marginTop: '2px' }}>
                        {b.slot_date} {b.slot_time} · {b.type}
                      </p>
                    </div>
                    <Badge status={b.status} />
                  </div>
                ))
              }
            </div>

          </div>
        )}

        {/* ── PREDICTIONS TAB ── */}
        {!dataLoading && tab === 'predictions' && (
          <div className="card" style={{ overflowX: 'auto' }}>
            <h3 className="admin-card__title">All Free Predictions ({predictions.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,161,74,0.2)' }}>
                  {['Date', 'Name', 'DOB', 'Place', 'Gender', 'Sign', 'Lagna', 'Dasha', 'Lang'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#c9a14a', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictions.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.4)', whiteSpace: 'nowrap' }}>
                      {new Date(p.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.6)' }}>{p.dob}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.6)' }}>{p.place}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.6)' }}>{p.gender}</td>
                    <td style={{ padding: '10px 12px', color: '#c9a14a' }}>{p.zodiac_sign}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.6)' }}>{p.lagna || '—'}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.6)' }}>{p.dasha || '—'}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.4)' }}>{p.locale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {predictions.length === 0 && <p className="admin-empty">No predictions yet.</p>}
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {!dataLoading && tab === 'bookings' && (
          <div className="card" style={{ overflowX: 'auto' }}>
            <h3 className="admin-card__title">All Bookings &amp; Schedules ({bookings.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,161,74,0.2)' }}>
                  {['Date', 'Name', 'Slot Date', 'Time', 'Type', 'Amount', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#c9a14a', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.4)', whiteSpace: 'nowrap' }}>
                      {new Date(b.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{b.name}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.6)' }}>{b.slot_date || '—'}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.6)' }}>{b.slot_time || '—'}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(245,239,224,0.6)', textTransform: 'capitalize' }}>{b.type}</td>
                    <td style={{ padding: '10px 12px', color: '#c9a14a', fontWeight: 600 }}>₹{b.amount}</td>
                    <td style={{ padding: '10px 12px' }}><Badge status={b.status} /></td>
                    <td style={{ padding: '10px 12px' }}>
                      <select
                        value={b.status}
                        onChange={e => updateStatus(b.id, e.target.value)}
                        style={{
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,161,74,0.2)',
                          color: '#f5efe0', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <p className="admin-empty">No bookings yet.</p>}
          </div>
        )}

      </div>
    </div>
  );
}
