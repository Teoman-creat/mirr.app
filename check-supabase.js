const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://guzatcuhupifrhkrnmxe.supabase.co', 'eyJhb... (wait I will just use the anon key)'); 
// Actually I need to put the full anon key. Let me just use dotenv properly.
require('dotenv').config({ path: '.env.local' });
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await client.storage.getBuckets();
  console.log("Buckets Error:", error ? error.message : "OK, count: " + data.length);
  
  const { data: tData, error: tError } = await client.from('analyses').select('id').limit(1);
  console.log("Analyses table check - Error:", tError ? tError.message : "OK, rows: " + tData.length);
}
check();
