import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import './UserDashboard.css';

const STATUS_COLORS = {
  pending:   { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', label: 'Pending'   },
  confirmed: { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', label: 'Confirmed' },
  completed: { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8', label: 'Completed' },
  cancelled: { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', label: 'Cancelled' },
};

function Badge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 12px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

export default function UserDashboard() {
  const { user, dataVersion, signOut } = useAuth();
  const [bookings,    setBookings]    = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [tab,         setTab]         = useState('bookings');
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [booksRes, predsRes] = await Promise.all([
        supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('free_predictions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (booksRes.error) console.error('Error loading dashboard bookings:', booksRes.error);
      if (predsRes.error) console.error('Error loading dashboard predictions:', predsRes.error);
      setBookings(booksRes.data || []);
      setPredictions(predsRes.data || []);
      setLoading(false);
    })();
  }, [user, dataVersion]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Seeker';
  const avatar      = user?.user_metadata?.avatar_url;

  return (
    <section id="dashboard" className="user-dash gold-border-top">
      <div className="container">

        {/* Section label */}
        <span className="section-label">✦ Your Cosmic Journey ✦</span>

        {/* Profile header */}
        <div className="user-dash__profile">
          <div className="user-dash__avatar-wrap">
            {avatar
              ? <img src={avatar} alt={displayName} className="user-dash__avatar" />
              : <div className="user-dash__avatar user-dash__avatar--fallback">{displayName[0].toUpperCase()}</div>
            }
            <div className="user-dash__avatar-ring" aria-hidden="true" />
          </div>
          <div className="user-dash__info">
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '4px', fontSize: '1.6rem' }}>
              Namaste, {displayName} ☽
            </h2>
            <p className="user-dash__email">{user?.email}</p>
          </div>
          <button className="user-dash__signout" onClick={signOut} aria-label="Sign out">
            Sign Out
          </button>
        </div>

        <div className="section-divider" />

        {/* Stats row */}
        <div className="user-dash__stats">
          <div className="user-dash__stat card">
            <span className="user-dash__stat-icon">🔮</span>
            <span className="user-dash__stat-val">{predictions.length}</span>
            <span className="user-dash__stat-label">Free Predictions</span>
          </div>
          <div className="user-dash__stat card">
            <span className="user-dash__stat-icon">📅</span>
            <span className="user-dash__stat-val">{bookings.length}</span>
            <span className="user-dash__stat-label">Total Bookings</span>
          </div>
          <div className="user-dash__stat card">
            <span className="user-dash__stat-icon">✅</span>
            <span className="user-dash__stat-val">{bookings.filter(b => b.status === 'confirmed').length}</span>
            <span className="user-dash__stat-label">Confirmed Sessions</span>
          </div>
          <div className="user-dash__stat card">
            <span className="user-dash__stat-icon">⏳</span>
            <span className="user-dash__stat-val">{bookings.filter(b => b.status === 'pending').length}</span>
            <span className="user-dash__stat-label">Pending</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="user-dash__tabs">
          {['bookings', 'predictions'].map(t => (
            <button
              key={t}
              className={`user-dash__tab${tab === t ? ' user-dash__tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'bookings' ? '📅 My Consultations' : '🔮 My Predictions'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="user-dash__loading">
            <div className="user-dash__spinner" aria-label="Loading" />
            <p>Consulting the stars…</p>
          </div>
        ) : (
          <>
            {/* Bookings tab */}
            {tab === 'bookings' && (
              bookings.length === 0 ? (
                <div className="user-dash__empty card">
                  <span className="user-dash__empty-icon">📅</span>
                  <p>No consultations booked yet.</p>
                  <a href="#booking" className="btn-gold btn-gold-outline">Book a Session</a>
                </div>
              ) : (
                <div className="user-dash__cards">
                  {bookings.map(b => (
                    <div key={b.id} className="user-dash__booking-card card">
                      <div className="user-dash__booking-top">
                        <div>
                          <div className="user-dash__booking-type">{b.type || 'Consultation'}</div>
                          <div className="user-dash__booking-date">
                            {b.slot_date
                              ? new Date(b.slot_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                              : 'Date TBD'
                            }
                            {b.slot_time && <span className="user-dash__booking-time"> · {b.slot_time}</span>}
                          </div>
                        </div>
                        <Badge status={b.status} />
                      </div>
                      <div className="user-dash__booking-meta">
                        <span>₹{b.amount || 500}</span>
                        <span>Booked {new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Predictions tab */}
            {tab === 'predictions' && (
              predictions.length === 0 ? (
                <div className="user-dash__empty card">
                  <span className="user-dash__empty-icon">🔮</span>
                  <p>No predictions generated yet.</p>
                  <a href="#prediction" className="btn-gold btn-gold-outline">Get Free Reading</a>
                </div>
              ) : (
                <div className="user-dash__cards">
                  {predictions.map(p => (
                    <div key={p.id} className="user-dash__pred-card card">
                      <div className="user-dash__pred-sign">{p.zodiac_sign}</div>
                      <div className="user-dash__pred-info">
                        <div className="user-dash__pred-title">{p.name}'s Reading</div>
                        <div className="user-dash__pred-meta">
                          {p.moon_sign && <span>🌙 {p.moon_sign}</span>}
                          {p.lagna     && <span>⬆ {p.lagna} Lagna</span>}
                          {p.dasha     && <span>🪐 {p.dasha} Dasha</span>}
                        </div>
                        {p.tagline && <p className="user-dash__pred-tagline">"{p.tagline}"</p>}
                      </div>
                      <div className="user-dash__pred-date">
                        {new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </section>
  );
}
