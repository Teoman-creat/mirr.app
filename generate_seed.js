const fs = require('fs');
const crypto = require('crypto');

const maleNames = ["Emre", "Can", "Burak", "Mert", "Kerem", "Kaan", "Cem", "Deniz", "Efe", "Ozan"];
const maleLast = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Öztürk", "Aydın", "Özdemir", "Arslan"];
const femaleNames = ["Ayşe", "Fatma", "Zeynep", "Elif", "Merve", "Ece", "Melis", "Ceren", "Seda", "Büşra"];

const cities = ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"];
const vibes = ["Minimalist", "Oturaklı", "Streetwear", "Old Money", "Y2K", "Techwear", "Classic", "Avant-Garde"];
const categories = ["streetwear", "casual", "formal", "date_night"];

const maleOutfitUrls = [
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&h=1200&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1200&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&h=1200&q=80",
    "https://images.unsplash.com/photo-1488161628813-0aa45bd72765?auto=format&fit=crop&w=800&h=1200&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&h=1200&q=80"
];

const femaleOutfitUrls = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&h=1200&q=80",
    "https://images.unsplash.com/photo-1529139574466-a30ab73d321d?auto=format&fit=crop&w=800&h=1200&q=80",
    "https://images.unsplash.com/photo-1492633423870-43d1cd2a4b07?auto=format&fit=crop&w=800&h=1200&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=1200&q=80",
    "https://images.unsplash.com/photo-1512436991641-70c1bcaa1977?auto=format&fit=crop&w=800&h=1200&q=80"
];

function generateUUID() {
    return crypto.randomUUID();
}

function randItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const outfitComments = [
    "Renklerin uyumu muazzam, tam bir klasik.",
    "Katmanlı giyim harika olmuş, modern bir hava katıyor.",
    "Aksesuarlar kombini bir üst seviyeye taşımış.",
    "Rahatlık ve şıklık mükemmel dengelenmiş.",
    "Baştan aşağı özgüven yansıtıyor."
];

let sql = `-- Hızlı 100 Kullanıcı, Profil, Analiz ve Gönderi Üretici\n`;
sql += `BEGIN;\n\n`;

// Önceki test kullanıcılarını silip çakışmayı önle
sql += `-- Önceki test kullanıcılarını temizle (Çakışma olmaması için)\n`;
sql += `DELETE FROM public.community_posts WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'testuser%@mirr.app');\n`;
sql += `DELETE FROM public.analyses WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'testuser%@mirr.app');\n`;
sql += `DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email LIKE 'testuser%@mirr.app');\n`;
sql += `DELETE FROM auth.users WHERE email LIKE 'testuser%@mirr.app';\n\n`;

const usedUsernames = new Set();

for(let i=1; i<=100; i++) {
    const isMale = Math.random() > 0.5;
    const fn = isMale ? randItem(maleNames) : randItem(femaleNames);
    const ln = isMale ? randItem(maleLast) : randItem(maleLast);
    const fullName = `${fn} ${ln}`;
    
    // Kullanıcı adından Türkçe karakterleri çıkarıp sade bir isim dene
    let baseUsername = `${fn.toLowerCase()}_${ln.toLowerCase()}`;
    baseUsername = baseUsername.replace(/ö/g,"o").replace(/ü/g,"u").replace(/ç/g,"c").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ğ/g,"g");
    
    let username = baseUsername;
    let usernameCounter = 1;
    // Sadece daha önce aynı isim kullanıldıysa sonuna rakam ekle
    while(usedUsernames.has(username)) {
        usernameCounter++;
        username = `${baseUsername}${usernameCounter}`;
    }
    usedUsernames.add(username);
    
    // Gerçek Unsplash görsellerinden rastgele seç (kedi veya heykel gelmemesi için)
    const avatarUrl = `https://i.pravatar.cc/150?u=${i}`;
    const outfitUrl = randItem(isMale ? maleOutfitUrls : femaleOutfitUrls);
    
    const userId = generateUUID();
    const analysisId = generateUUID();
    const postId = generateUUID();
    
    const email = `testuser${i}@mirr.app`;
    const encryptedPassword = '$2a$10$abcdefghijklmnopqrstuv'; // fake hash
    
    const vibe = randItem(vibes);
    const cat = randItem(categories);
    const comment = randItem(outfitComments);
    const score = Math.floor(Math.random() * 30) + 70; // 70 to 99
    
    // Insert auth.users
    sql += `INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) `;
    sql += `VALUES ('${userId}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${email}', '${encryptedPassword}', now(), '{"full_name": "${fullName}"}', now(), now());\n`;
    
    // Insert public.profiles
    sql += `INSERT INTO public.profiles (id, full_name, username, avatar_url, style_dna, city, country, is_public) `;
    sql += `VALUES ('${userId}', '${fullName}', '${username}', '${avatarUrl}', '{"vibe": "${vibe}"}'::jsonb, '${randItem(cities)}', 'Turkey', true);\n`;
    
    // Insert public.analyses (OUTFIT)
    sql += `INSERT INTO public.analyses (id, user_id, image_url, type, aura_score, vibe, reasoning, strengths, improvements) `;
    sql += `VALUES ('${analysisId}', '${userId}', '${outfitUrl}', 'OUTFIT', ${score}, '${vibe}', '${comment}', '["Uyumlu Renkler"]'::jsonb, '["Belki farklı bir kemer"]'::jsonb);\n`;
    
    // Insert public.community_posts
    // Give them some random initial vote score
    const voteCount = Math.floor(Math.random() * 15) + 1;
    const totalScore = (Math.floor(Math.random() * 4) + 6) * voteCount; 
    
    sql += `INSERT INTO public.community_posts (id, user_id, analysis_id, category, total_score, vote_count) `;
    sql += `VALUES ('${postId}', '${userId}', '${analysisId}', '${cat}', ${totalScore}, ${voteCount});\n\n`;
}

sql += `COMMIT;\n`;

fs.writeFileSync('seed_100_users.sql', sql);
console.log("seed_100_users.sql generated successfully.");
