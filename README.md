# Ekalaya Laptop Hub — 3D Virtual Showroom & Store

Showroom dan toko laptop 3D interaktif berbasis browser, dilengkapi showcase 3D laptop (Gaming RTX, Ultrabook OLED, MacBook Pro Studio, Laptop Pelajar), avatar dengan pergerakan fisika halus, mode tampilan **Cerah / Gelap (Light / Dark Mode)**, kontrol kamera fleksibel (Orbit, Panorama & Zoom), sistem pesanan & invoice instan, serta integrasi otomatisasi **n8n** (Tahap 1, Tahap 2, & Tahap 3).

---

## 🌟 Rangkuman Fitur Lengkap Berdasarkan Tahapan

### 🏗️ Tahap 1: Fondasi & Showroom 3D
- **Dunia Virtual 3D Real-time (Three.js)**: Lantai marmer/obsidian luas tanpa penghalang atas (*open ceiling*).
- **Pergerakan Karakter Halus**: Akselerasi inersia, belokan melengkung halus (*slerp*), kemiringan badan (*banking tilt*), ayunan kaki, dan kamera bebas stutter.
- **Mode Cerah & Gelap**: Berpindah mulus antara tema terang studio Apple-style dan tema gelap neon cyberpunk tech.
- **Kontrol Navigasi & Kamera Lengkap**:
  - `Klik Kiri Drag`: Putar rotasi kamera (Orbit 360°).
  - `Klik Kanan Drag`: Geser panorama kamera (Panning).
  - `Scroll Roda Mouse`: Zoom In / Zoom Out.
  - `WASD / Panah`: Berjalan mengikuti arah kamera aktif.
  - `Klik Kiri Lantai`: Click-to-Move.
  - `Tombol ⛶`: Layar Penuh (Fullscreen).

### ⚡ Tahap 2: Penjualan, Checkout & Invoice Otomatis
- **Tombol "Beli Sekarang"**: Tersedia langsung di setiap kartu laptop.
- **Penerbitan Invoice Digital Instan**: Nomor invoice unik (contoh: `INV-EKL-2026-XXXX`), rincian pesanan, kupon diskon `EKALAYA-LAPTOP-500K`, dan alamat pengiriman.
- **Simulasi Pembayaran QRIS & Virtual Account**: Status menunggu pembayaran dan tombol simulasi pelunasan langsung.
- **Webhook Penjualan n8n**: Mengirim event `laptop_order_created` dan `laptop_payment_confirmed`.
- **Katalog 2D Cepat**: Pilihan tampilan ringan ramah koneksi/HP hemat baterai.

### 🚀 Tahap 3: Pertumbuhan, AI & Otomatisasi Lanjutan
- **Smart Spec Matcher AI ("Cari Spek")**: Kuesioner cerdas 2 langkah yang merekomendasikan laptop ideal dan dapat langsung menyorot unitnya di showroom 3D.
- **Benchmark Studio Komparasi Nyata**: Perbandingan grafis FPS dan render time (Cyberpunk 2077 Ultra Ray Tracing, Valorant, Blender 3D, Premiere Pro 4K).
- **Live Flash Sale Countdown**: Ticker hitung mundur event promo dengan diskon s/d 35%.
- **Dashboard Analitik & Laporan Harian Pemilik Toko**:
  - Menghitung pengunjung harian, total leads, pesanan masuk, dan omset toko.
  - Tombol **"Kirim Laporan Harian ke WhatsApp Sekarang"** yang men-trigger webhook n8n untuk mengirimkan format pesan laporan ke WhatsApp/Telegram pemilik toko.
- **Chatbot Maya Cerdas**: Asisten konsultasi yang paham simulasi kredit/cicilan 0%, garansi ADP, dan spesifikasi hardware.

### 💎 Tahap 4: Optimasi, Skalabilitas & Program Loyalitas
- **Kustomisasi Avatar Manusia 3D (Wardrobe Customizer)**:
  - Pilihan preset tema outfit: *Tech Navy*, *ROG Cyber Crimson*, *Studio Pro Violet*, *Executive White*, dan *Stealth Obsidian*.
  - Warna rambut kustom (Espresso, Chestnut, Platinum).
  - Toggle kacamata pintar (*smart spectacles*).
- **Simulasi Cicilan 0% Multi-Bank & PayLater**:
  - Pilihan tenor 3, 6, 12, dan 24 bulan dengan estimasi angsuran per bulan otomatis.
  - Didukung rekanan BCA, Mandiri, BNI, BRI, Mega, serta SpayLater & Kredivo.
- **Program Referral VIP & Loyalty Hub**:
  - Generator link & kode referral pribadi pengunjung (komisi tunai Rp 250.000 / laptop terjual).
  - Tingkat keanggotaan loyalitas: *Silver*, *Gold*, dan *Platinum VIP Partner*.
- **Corong Konversi Pelanggan (Customer Journey Funnel)**:
  - Pelacakan rasio konversi visual: Kunjungan (100%) → Eksplorasi (71.8%) → Benchmark (40.8%) → Leads (12.6%) → Pembeli (4.2%).
- **Ekspor Data CRM & Akuntansi (CSV Export)**:
  - Tombol **"Unduh CSV"** langsung dari dashboard analitik untuk mengunduh rekap leads dan penjualan toko.

---

## 🚀 Cara Menjalankan Server Lokal

```bash
# Jalankan server
node server.js
```

Buka di browser Anda:
👉 **[http://localhost:5050](http://localhost:5050)**

---

## ⚡ Setup Workflow n8n

1. Buka dashboard n8n.
2. Import file [n8n-workflow-ekalaya-lead-capture.json](n8n-workflow-ekalaya-lead-capture.json).
3. Aktifkan workflow (`Active: ON`).
4. Di web virtual office, buka menu **⚙️ (Pengaturan)** dan tempel URL Webhook n8n Anda.
