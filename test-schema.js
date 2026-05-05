import { createClient } from '@supabase/supabase-js';

const url = 'https://tpiplgoqrxhqytwuzbhp.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaXBsZ29xcnhocXl0d3V6YmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjUyODMsImV4cCI6MjA5MzQwMTI4M30.bPudpH9IqAfnDMh5-saskjG-_Xl_JGg9yEsz6tqh-FI';
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('bookings').select('*').limit(1);
  console.log('Bookings error:', error);
  console.log('Bookings data:', data);

  // Try to insert a dummy row
  const { error: insertError } = await supabase.from('bookings').insert({
    name: 'test',
    status: 'pending',
    amount: 0,
    user_id: '00000000-0000-0000-0000-000000000000'
  });
  console.log('Insert error with user_id:', insertError);
}
check();
