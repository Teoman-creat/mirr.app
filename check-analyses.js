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
  try {
    const { data: analyses, error } = await client
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
      
    if (error) {
        console.error("Error fetching analyses:", error);
    } else {
        console.log("Found", analyses?.length, "recent analyses:");
        analyses.forEach((a, i) => {
            console.log(`\n--- Item ${i + 1} ---`);
            console.log(`ID: ${a.id}`);
            console.log(`User ID: ${a.user_id}`);
            console.log(`Type: ${a.type}`);
            console.log(`Image URL: ${a.image_url}`);
            console.log(`Vibe: ${a.vibe}`);
            console.log(`Reasoning: ${a.reasoning}`);
            console.log(`Created At: ${a.created_at}`);
        });
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}
run();
