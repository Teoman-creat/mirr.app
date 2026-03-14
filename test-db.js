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
    const { data: buckets, error: bError } = await client.storage.listBuckets();
    console.log('Buckets:', { count: buckets?.length, error: bError?.message });
    
    // Check if the 'analyses' bucket exists
    const hasAnalysesBucket = buckets?.some(b => b.name === 'analyses');
    console.log('Has "analyses" bucket:', hasAnalysesBucket);
    
    const { data: analysesData, error: aError } = await client.from('analyses').select('id').limit(1);
    console.log('Analyses table:', { rows: analysesData?.length, error: aError?.message });

    // Test insert with anon (might fail due to RLS, but we'll see exactly what error)
    const { data: insertData, error: insertError } = await client.from('analyses').insert({
        user_id: '123e4567-e89b-12d3-a456-426614174000', // random uuid
        image_url: 'http://test.com',
        type: 'OUTFIT',
        aura_score: 90,
        strengths: ['1', '2'],
        improvements: ['1', '2'],
        raw_ai_response: { test: true }
    });
    console.log('Insert test error:', insertError);
  } catch (err) {
    console.error('Exception:', err);
  }
}
run();
