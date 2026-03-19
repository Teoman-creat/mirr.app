const fs = require('fs');
const dotenvConfig = fs.readFileSync('.env.local', 'utf8');
dotenvConfig.split('\n').filter(l => l.startsWith('NEXT_PUBLIC_') || l.startsWith('SUPABASE_')).forEach(l => {
  const i = l.indexOf('=');
  if (i > -1) {
    process.env[l.substring(0, i).trim()] = l.substring(i+1).trim().replace(/['"]/g, '');
  }
});
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await client.from('profiles').select('*').limit(1);
  console.log("Profiles schema check (1 row):", data, error);
}

check();
