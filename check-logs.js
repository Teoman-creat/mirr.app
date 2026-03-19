const fs = require('fs');
const dotenvConfig = fs.readFileSync('.env.local', 'utf8');
dotenvConfig.split('\n').filter(l => l.startsWith('NEXT_PUBLIC_')).forEach(l => {
  const i = l.indexOf('=');
  if (i > -1) {
    process.env[l.substring(0, i).trim()] = l.substring(i+1).trim().replace(/['"]/g, '');
  }
});
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await client
    .from('analyses')
    .select('created_at, type, strengths, improvements, raw_ai_response')
    .order('created_at', { ascending: false })
    .limit(3);
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}
run();
