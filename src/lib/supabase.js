import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Helper: save a free prediction to Supabase ──────────────────────────────
export async function savePrediction({
  name, dob, tob, place, gender,
  zodiacSign, moonSign, nakshatra, lagna, dasha, tagline, locale, userId
}) {
  const { error } = await supabase.from('free_predictions').insert([{
    name, dob, tob: tob || null, place, gender,
    zodiac_sign: zodiacSign,
    moon_sign:   moonSign,
    nakshatra,
    lagna,
    dasha,
    tagline,
    locale: locale || 'en',
    user_id: userId || null,
  }]);
  if (error) console.error('[Supabase] savePrediction error:', error.message);
}

// ── Helper: save a consultation booking ─────────────────────────────────────
export async function saveBooking({ name, email, phone, slotDate, slotTime, type, amount, paymentId, notes }) {
  const { error } = await supabase.from('bookings').insert([{
    name,
    email:      email || null,
    phone:      phone || null,
    slot_date:  slotDate || null,
    slot_time:  slotTime || null,
    type:       type || 'consultation',
    amount:     amount || 500,
    status:     'pending',
    payment_id: paymentId || null,
    notes:      notes || null
  }]);
  if (error) console.error('[Supabase] saveBooking error:', error.message);
}
