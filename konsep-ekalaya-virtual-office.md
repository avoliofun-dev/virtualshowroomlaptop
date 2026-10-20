# Konsep Ekalaya 3D Virtual Office untuk Pemasaran Produk Online

> Showroom interaktif berbasis browser yang diotomasi dengan n8n untuk mengubah pengunjung menjadi lead dan pembeli.

---

## 1. Ringkasan

**Ekalaya Office** adalah kantor virtual 3D di browser (https://ekalaya-office.vercel.app/). Pengunjung bisa berjalan bebas, melihat produk, mengobrol dengan tim, dan mengikuti demo atau event.

Dalam konsep ini, kantor virtual berfungsi sebagai **showroom dan ruang penjualan interaktif**, sementara **n8n** bekerja di belakang layar untuk menangkap lead, menindaklanjuti, dan memproses pesanan secara otomatis.

**Nilai pembeda:** pengalaman berbelanja yang berkesan dan personal, bukan sekadar katalog atau halaman toko biasa.

---

## 2. Tujuan

| Tujuan | Indikator keberhasilan |
|---|---|
| Menarik pengunjung baru | Jumlah pengunjung unik per minggu |
| Mengumpulkan lead | Jumlah kontak yang terkumpul per minggu |
| Meningkatkan penjualan | Jumlah pesanan dan nilai transaksi |
| Membangun brand | Pengunjung kembali, share di media sosial |
| Menghemat tenaga admin | Persentase proses yang berjalan otomatis |

---

## 3. Target Pengguna

*(Isi sesuai produk Anda)*

- **Segmen utama:** ...
- **Usia / profil:** ...
- **Masalah yang diselesaikan produk:** ...
- **Perangkat dominan:** HP / laptop

---

## 4. Konsep Ruang di Kantor Virtual

| Ruang | Fungsi pemasaran |
|---|---|
| **Lobby / Resepsionis** | Menyapa pengunjung, meminta nama dan kontak, memberi arahan |
| **Ruang Display Produk** | Satu area per kategori produk, dengan detail, foto, harga, dan tombol beli |
| **Ruang Meeting / Demo** | Demo produk, live selling, sesi tanya jawab terjadwal |
| **Ruang Event** | Peluncuran produk, flash sale, webinar |
| **Pantry / Lounge** | Ruang santai untuk komunitas, ngobrol antar pelanggan, testimoni |
| **Ruang Promo** | Voucher, penawaran terbatas, program referral |

---

## 5. Perjalanan Pengunjung (Customer Journey)

```
Menemukan (iklan, sosmed, marketplace)
        ↓
Masuk kantor virtual → disapa di Lobby
        ↓
Isi nama & kontak (lead tercatat)
        ↓
Jelajahi ruang display → lihat produk
        ↓
Tanya via chat / bot AI
        ↓
Checkout atau lanjut ke WhatsApp
        ↓
Pembayaran → konfirmasi otomatis
        ↓
Follow-up, minta ulasan, tawarkan produk lanjutan
```

---

## 6. Arsitektur Teknis

```
Pengunjung (browser)
        ↓
Web Ekalaya Office (Vercel)
        ↓
API Route / Serverless Function  ← menyimpan secret di Environment Variable
        ↓
Cloudflare Tunnel (URL publik)
        ↓
n8n (server lokal / VPS)
        ↓
Google Sheets · CRM · WhatsApp · Email · Payment Gateway · AI
```

### Catatan teknis penting

- **Panggil n8n dari backend**, bukan langsung dari browser, agar URL dan secret tidak terlihat publik.
- **Set `WEBHOOK_URL`** di n8n sesuai URL tunnel Cloudflare, lalu restart n8n.
- **Gunakan `/webhook/`** (production) di Vercel, bukan `/webhook-test/`. Workflow harus berstatus **Active**.
- **Amankan webhook** dengan header token rahasia.
- **Redeploy Vercel** setiap kali menambah atau mengubah Environment Variable.
- **Quick Tunnel** (`trycloudflare.com`) URL-nya berubah saat dijalankan ulang. Untuk produksi, gunakan **Named Tunnel** dengan domain sendiri, atau pindahkan n8n ke VPS.

### Contoh Environment Variable di Vercel

| Variabel | Fungsi |
|---|---|
| `N8N_WEBHOOK_URL` | URL webhook n8n (via Cloudflare) |
| `N8N_SECRET` | Token rahasia untuk memverifikasi permintaan |

---

## 7. Workflow n8n yang Direkomendasikan

### A. Penangkapan Lead
- **Pemicu:** pengunjung mengisi form di Lobby
- **Aksi:** simpan ke Google Sheets / CRM → kirim notifikasi ke tim → kirim pesan sambutan

### B. Follow-up Otomatis
- **Pemicu:** lead baru atau pengunjung yang melihat produk tapi belum membeli
- **Aksi:** pesan WhatsApp/email setelah beberapa menit → pengingat hari ke-1 dan ke-3 → berhenti jika sudah membeli

### C. Chatbot AI Produk
- **Pemicu:** pertanyaan dari pengunjung di chat
- **Aksi:** AI menjawab tentang produk, harga, dan stok → jika pengunjung siap membeli atau pertanyaannya rumit, oper ke tim manusia

### D. Pesanan dan Pembayaran
- **Pemicu:** pengunjung checkout
- **Aksi:** buat pesanan → kirim invoice dan link pembayaran → perbarui status setelah pembayaran masuk → beri tahu tim pengemasan

### E. Notifikasi Event
- **Pemicu:** pendaftaran event / demo
- **Aksi:** konfirmasi pendaftaran → pengingat sebelum acara → kirim rekaman atau penawaran setelah acara

### F. Laporan Harian
- **Pemicu:** jadwal tiap pagi
- **Aksi:** rangkum pengunjung, lead, dan penjualan → kirim ke pemilik lewat WhatsApp/Telegram

---

## 8. Kebutuhan Tim

| Tahap | Jumlah | Peran |
|---|---|---|
| **Validasi awal** | 1-2 orang | Pemilik + satu orang untuk konten dan membalas chat |
| **Mulai berjalan** | 3-4 orang | Tambah sales/CS, content creator, admin order |
| **Berkembang** | 5-8 orang | Tambah spesialis iklan, developer paruh waktu, tim fulfillment |

**Peran inti:**

1. **Pemilik / Manajer** — strategi dan keputusan
2. **Sales / Customer Service** — menangani chat dan menutup penjualan
3. **Content Creator** — konten sosmed untuk mendatangkan trafik
4. **Developer / Admin Teknis** — merawat web dan n8n (bisa paruh waktu)
5. **Admin Order / Keuangan** — verifikasi pembayaran dan pengiriman

> Untuk produk fisik, pengemasan dan pengiriman bisa memakai jasa fulfillment pihak ketiga.

---

## 9. Strategi Mendatangkan Trafik

Kantor virtual yang baru tidak akan ramai dengan sendirinya. Trafik adalah tantangan utama.

- **Konten pendek** (TikTok, Reels, YouTube Shorts) yang mengajak orang "masuk ke kantor kami"
- **Iklan berbayar** ke target yang spesifik
- **Event terjadwal** (live demo, flash sale) agar ada alasan datang di waktu tertentu
- **Marketplace dan media sosial** tetap dipakai sebagai pintu masuk, dengan kantor virtual sebagai pengalaman tambahan
- **Referral dan voucher** untuk pelanggan yang mengajak teman

---

## 10. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| 3D berat di HP spek rendah / internet lambat | Sediakan katalog 2D biasa dan tombol langsung ke WhatsApp |
| Server lokal mati atau IP berubah | Pakai Named Tunnel + jalankan `cloudflared` sebagai service, atau pindah ke VPS |
| URL Quick Tunnel berubah | Pakai domain sendiri untuk tunnel |
| Webhook disalahgunakan | Token rahasia, validasi input, batasi laju permintaan |
| Data pelanggan bocor | Simpan secret di Environment Variable, batasi akses, patuhi aturan perlindungan data pribadi |
| Trafik sepi | Alokasikan sebagian besar tenaga dan anggaran ke konten dan iklan |

---

## 11. Rencana Tahapan

### Tahap 1 — Fondasi (minggu 1-2)
- [ ] Tentukan produk, target pembeli, dan penawaran utama
- [ ] Rapikan ruang Lobby dan satu ruang display
- [ ] Hubungkan Vercel ke n8n lewat Cloudflare
- [ ] Buat workflow penangkapan lead + notifikasi

### Tahap 2 — Penjualan (minggu 3-4)
- [ ] Tambah katalog produk dan tombol beli / WhatsApp
- [ ] Buat workflow pesanan dan pembayaran
- [ ] Pasang follow-up otomatis
- [ ] Sediakan versi 2D untuk perangkat lemah

### Tahap 3 — Pertumbuhan (bulan 2-3)
- [ ] Chatbot AI untuk pertanyaan produk
- [ ] Event dan live demo rutin
- [ ] Laporan harian otomatis
- [ ] Mulai iklan dan konten rutin

### Tahap 4 — Optimasi (bulan 3+)
- [ ] Analisis data pengunjung dan konversi
- [ ] Pindahkan n8n ke VPS jika sudah stabil
- [ ] Tambah tim sesuai beban kerja
- [ ] Program referral dan pelanggan setia

---

## 12. Metrik yang Dipantau

- Jumlah pengunjung unik dan durasi kunjungan
- Jumlah lead dan tingkat konversi lead → pembeli
- Nilai rata-rata pesanan
- Ruang atau produk yang paling banyak dikunjungi
- Waktu respons chat
- Persentase proses yang berjalan otomatis

---

## 13. Langkah Berikutnya

1. Lengkapi bagian **Target Pengguna** dan jenis produk.
2. Pilih satu alur paling penting untuk dibangun lebih dulu, disarankan **penangkapan lead**.
3. Uji koneksi Vercel → Cloudflare → n8n dengan satu webhook sederhana.
4. Bangun, uji, lalu tambah fitur secara bertahap.
