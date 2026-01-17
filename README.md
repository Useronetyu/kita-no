# CyberCoin (IGC) - Web3 Play-to-Earn Ecosystem

**CyberCoin (IGC)** adalah sebuah *Decentralized Application* (DApp) berbasis web yang mensimulasikan ekosistem *Play-to-Earn* (P2E) secara komprehensif. Proyek ini dibangun untuk mendemonstrasikan integrasi antara antarmuka pengguna (UI) modern dengan dompet kripto (Web3 Wallet) dalam skenario ekonomi game digital.

Aplikasi ini memungkinkan pengguna untuk menghubungkan dompet MetaMask mereka, menambang sumber daya (*mining*), melakukan *staking* aset, bermain *mini-games* di Arcade, serta melakukan transaksi jual-beli NFT secara *Peer-to-Peer*.

## 🌟 Fitur Utama

Aplikasi ini terdiri dari empat pilar utama yang saling terintegrasi:

### 1. 💎 Dashboard Ekonomi (Economy Core)
Pusat kendali utama bagi pengguna dengan tata letak Grid responsif.
* **Mining Zone:** Simulasi penambangan sumber daya (*Resources*) dengan interaksi klik. Dilengkapi efek partikel visual dan umpan balik suara.
* **Staking Vault:** Fitur untuk mengunci koin IGC demi mendapatkan "Mining Boost" (Multiplier 1.5x) pada aktivitas penambangan.
* **Resource Exchange:** Mekanisme konversi nilai tukar dari *Raw Resources* menjadi token mata uang utama (*IGC Coin*).
* **Daily Rewards:** Sistem retensi pengguna berupa kalender 7 hari dengan hadiah progresif (Bonus Besar di hari ke-7).

### 2. 🎮 Arcade Center
Kumpulan *mini-games* interaktif yang menggunakan *Resources* sebagai taruhan (*betting*) dengan logika probabilitas yang adil:
* **Blackjack:** Permainan kartu klasik Player vs Dealer.
* **Spin The Wheel:** Roda keberuntungan dengan fisika putaran yang realistis (*smooth easing*).
* **Dice Roll:** Permainan dadu probabilitas tinggi.
* **Coin Flip:** Taruhan cepat (Heads/Tails).
* **Clicker Blitz:** Mode tantangan kecepatan (30 detik).

### 3. 🖼️ NFT Marketplace
Ekosistem perdagangan aset digital berupa lencana (*Badges*) beranimasi.
* **Minting Station:** Pengguna dapat mencetak (*mint*) NFT baru menggunakan saldo IGC mereka.
* **P2E Trading:** Pengguna dapat mendaftarkan koleksi mereka untuk dijual (*List for Sale*) dan membeli NFT milik orang lain dari *Global Feed*.
* **Visual Tier:** Aset NFT dikategorikan berdasarkan kelangkaan (Bronze, Silver, Gold, Legendary) dengan efek visual neon yang berbeda.

### 4. 👤 Profil & Identitas Web3
Halaman manajemen identitas pengguna.
* **Wallet Integration:** Menampilkan alamat dompet asli (e.g., `0x12...89B`) dan saldo ETH secara *real-time*.
* **Rank System:** Lencana peringkat dinamis berdasarkan kepemilikan aset (Bronze, Silver, Platinum, Master).
* **Transaction History:** Log aktivitas transparan yang mencatat setiap klaim, transfer, dan hasil permainan.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Proyek ini dibangun menggunakan standar industri pengembangan web modern:

* **Frontend Framework:** React.js (Vite)
* **Styling:** Tailwind CSS (untuk desain responsif dan *Glassmorphism*).
* **Icons:** Lucide React.
* **Animation:** Framer Motion (untuk transisi halaman dan efek partikel).
* **Web3 Integration:** `window.ethereum` API (Direct Injection) untuk koneksi MetaMask tanpa ketergantungan *third-party* yang berat.
* **State Management:** React Hooks & Context API.

---

## 🚀 Cara Menjalankan Project (Installation)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di komputer lokal (Localhost):

**Prasyarat:**
1.  Pastikan **Node.js** sudah terinstal di komputer.
2.  Pastikan Browser (Chrome/Edge/Brave) memiliki ekstensi **MetaMask**.

**Langkah Instalasi:**

1.  **Clone Repository / Extract File:**
    Unduh source code dan ekstrak ke folder tujuan.

2.  **Masuk ke Direktori Proyek:**
    Buka terminal (Command Prompt/Terminal) dan arahkan ke folder proyek.
    ```bash
    git clone https://github.com/Useronetyu/kita-no.git
    cd kita-no
    ```

3.  **Instal Dependensi:**
    Jalankan perintah berikut untuk mengunduh semua *library* yang dibutuhkan:
    ```bash
    npm install
    ```

4.  **Jalankan Server Lokal:**
    Aktifkan mode pengembangan:
    ```bash
    npm run dev
    ```

5.  **Buka di Browser:**
    Klik link yang muncul di terminal (biasanya `http://localhost:8080` atau `http://localhost:5173`).

---

## 🔗 Panduan Koneksi Wallet (Penting)

Aplikasi ini menggunakan metode **Direct Web3 Injection**.

1.  Klik tombol **"Connect Wallet"** di pojok kanan atas.
2.  *Pop-up* ekstensi MetaMask akan muncul meminta izin koneksi.
3.  Klik **"Approve"** atau **"Connect"**.
4.  Setelah terhubung, alamat dompet Anda akan muncul di *header*.
    * *Catatan:* Jika Anda membuka aplikasi ini di perangkat yang tidak memiliki MetaMask, sistem akan secara otomatis masuk ke "Simulation Mode" agar fitur aplikasi tetap dapat didemonstrasikan.

---

## 📱 Responsivitas Mobile

Aplikasi ini didesain dengan pendekatan *Mobile-First*:
* **Navigasi:** Menggunakan *Hamburger Menu* (Drawer) pada layar kecil.
* **Layout:** Grid otomatis berubah dari 2 kolom (Desktop) menjadi 1 kolom vertikal (Mobile) untuk kenyamanan *scrolling*.
* **Missions:** Modal misi tampil presisi di tengah layar dengan latar belakang *backdrop blur*.

---

## 📝 Lisensi & Kredit

Proyek ini dikembangkan sebagai bagian dari tugas simulasi implementasi Kriptografi dan Pengembangan Web3.
**Developer:** Mochamad Ilham Hansyil
**Tahun:** 2026

---
*Dibuat dengan dedikasi tinggi untuk mengeksplorasi masa depan internet terdesentralisasi.*