import { createClient } from '@supabase/supabase-js';

const url = 'https://tpiplgoqrxhqytwuzbhp.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaXBsZ29xcnhocXl0d3V6YmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjUyODMsImV4cCI6MjA5MzQwMTI4M30.bPudpH9IqAfnDMh5-saskjG-_Xl_JGg9yEsz6tqh-FI';
const supabase = createClient(url, key);

async function testBooking() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';
  
  // 1. Sign up
  const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
  if (authErr) {
    console.error('SignUp Error:', authErr);
    return;
  }
  
  const user = authData.user;
  console.log('Signed up user:', user.id);
  
  // 2. Insert Booking
  const { error: insertErr } = await supabase.from('bookings').insert({
    name: 'Test User',
    email: email,
    slot_date: '2026-05-15',
    slot_time: 'Morning',
    type: 'consultation',
    amount: 0,
    status: 'pending',
    user_id: user.id
  });
  
  if (insertErr) {
    console.error('Insert Error:', insertErr);
    return;
  }
  console.log('Booking inserted successfully!');
  
  // 3. Fetch Booking
  const { data: bookings, error: fetchErr } = await supabase.from('bookings').select('*').eq('user_id', user.id);
  
  if (fetchErr) {
    console.error('Fetch Error:', fetchErr);
    return;
  }
  
  console.log('Fetched Bookings for user:', bookings);
}

testBooking();
