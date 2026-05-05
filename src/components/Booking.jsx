import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from '../posthog.js';
import { useAuth } from '../lib/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import './Booking.css';

const SLOTS = ['Morning · 10:00 AM', 'Afternoon · 2:00 PM', 'Evening · 6:00 PM'];

function getDays() {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MON_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function initiateRazorpayPayment(selectedDay, selectedSlot) {
  track('booking_payment_initiated', { day: selectedDay, slot: selectedSlot, amount: 500 });
  const msg = `Booking: ${selectedDay} at ${selectedSlot}\nAmount: ₹500 / 30 min\n\nProceed to payment? (Demo Mode)`;
  if (window.confirm(msg)) {
    const payments = JSON.parse(localStorage.getItem('astroPayments') || '[]');
    payments.push({
      paymentId: 'demo_' + Date.now(),
      amount: 500,
      slot: `${selectedDay} ${selectedSlot}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    });
    localStorage.setItem('astroPayments', JSON.stringify(payments));
    track('booking_payment_completed', { day: selectedDay, slot: selectedSlot, amount: 500 });
    alert('✅ Payment successful! Ayush will contact you to confirm the session.');
  }
}

export default function Booking() {
  const days = getDays();
  const [selDay, setSelDay] = useState(0);
  const [selSlot, setSelSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);
  const { t } = useTranslation();
  const { user, requireAuth, hasClaimedFreeConsult, refreshClaimStatus } = useAuth();
  
  const isFree = user && !hasClaimedFreeConsult;
  const currentAmount = isFree ? 0 : 500;

  const dayLabel = `${DAY_NAMES[days[selDay].getDay()]} ${days[selDay].getDate()} ${MON_NAMES[days[selDay].getMonth()]}`;

  const handleBook = async () => {
    if (!selSlot || !user) return;
    setBooking(true);
    track('booking_payment_initiated', { day: dayLabel, slot: selSlot, amount: currentAmount });
    const { error } = await supabase.from('bookings').insert({
      name:      user?.user_metadata?.full_name || user?.email || 'Guest',
      email:     user?.email,
      slot_date: days[selDay].toISOString().slice(0, 10),
      slot_time: selSlot,
      type:      'consultation',
      amount:    currentAmount,
      status:    'pending',
      user_id:   user.id,
    });
    console.log('Booking attempt result:', { error });
    setBooking(false);
    if (!error) {
      console.log('Booking successful, refreshing status...');
      setDone(true);
      setSelSlot(null);
      refreshClaimStatus();
      track('booking_completed', { day: dayLabel, slot: selSlot, amount: currentAmount });
    } else {
      console.error('Booking failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const FEATURES = [
    'Full birth chart analysis (Parashari method)',
    'Career, finance & relationship insights',
    'Personalized remedies & gemstone advice',
    'Auspicious dates for key decisions',
    'Session recording delivered after',
  ];

  return (
    <section id="booking" className="booking gold-border-top">
      <div className="container">
        <span className="section-label">✦ {t('booking.label')} ✦</span>
        <h2 className="section-title">{t('booking.title')}</h2>
        <div className="section-divider" />

        <div className="booking__grid">
          {/* Left */}
          <div className="booking__features">
            <h3 className="booking__feat-title">{t('booking.included')}</h3>
            <ul className="booking__feat-list">
              {FEATURES.map(f => (
                <li key={f}><span>◆</span>{f}</li>
              ))}
            </ul>
            <div className="booking__trust">
              {t('booking.trust', { returnObjects: true }).map(t => (
                <span key={t} className="trust-badge">{t}</span>
              ))}
            </div>
          </div>

          {/* Right: booking flow */}
          <div className="booking__flow card">
            <p className="booking__step-label">{t('booking.step1')}</p>

            {/* Day strip */}
            <div className="booking__days">
              {days.map((d, i) => (
                <button
                  key={i}
                  className={`day-btn${selDay === i ? ' day-btn--active' : ''}`}
                  onClick={() => { setSelDay(i); setSelSlot(null); }}
                >
                  <span className="day-btn__name">{DAY_NAMES[d.getDay()]}</span>
                  <span className="day-btn__num">{d.getDate()}</span>
                  <span className="day-btn__month">{MON_NAMES[d.getMonth()]}</span>
                </button>
              ))}
            </div>

            {/* Time slots */}
            <div className="booking__slots">
              {SLOTS.map(s => (
                <button
                  key={s}
                  className={`slot-btn${selSlot === s ? ' slot-btn--active' : ''}`}
                  onClick={() => { setSelSlot(s); track('booking_slot_selected', { slot: s, day: dayLabel }); }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="booking__total">
              <span>{t('booking.total')}</span>
              <span className="booking__price">
                ₹{currentAmount} {isFree && <span style={{ color: '#4ade80', fontSize: '0.8rem', marginLeft: '6px' }}>(Free First Consultation)</span>}
                <small>{t('booking.period')}</small>
              </span>
            </div>

            {done && (
              <div style={{
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '10px', padding: '14px 18px', textAlign: 'center',
                color: '#4ade80', fontSize: '0.88rem', marginBottom: '1rem'
              }}>
                ✅ Booking confirmed! Ayush will contact you to finalise the session.
              </div>
            )}

            <button
              className="btn-gold btn-gold-filled booking__pay"
              disabled={(!selSlot && user) || booking}
              onClick={() => user ? handleBook() : requireAuth()}
            >
              {!user 
                ? 'Sign In to Book'
                : booking 
                  ? 'Booking…' 
                  : selSlot 
                    ? `💳 ${currentAmount === 0 ? 'Claim Free' : 'Pay ₹500'} — ${selSlot}`
                    : t('booking.selectSlot')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
