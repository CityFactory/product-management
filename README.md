# Product Management Dashboard - Technical Test

Ini adalah proyek technical test untuk Summit Global Teknologi, dibuat menggunakan Next.js 14 (App Router), TypeScript, dan Ant Design.

## Fitur
* **CRUD** (Create, Read, Update, Delete) untuk produk.
* **Search** real-time (debounce 300ms) berdasarkan judul, deskripsi, dan kategori.
* **Pagination** sisi server.
* **Arsitektur Proxy** menggunakan API Routes Next.js untuk berkomunikasi dengan backend eksternal.

## Persyaratan Sistem
* Node.js v18.0 atau lebih baru
* npm (v9 atau lebih baru) atau yarn

---

## 🚀 Cara Menjalankan Proyek

Proyek ini membutuhkan **dua terminal** yang berjalan bersamaan:
1.  **Server Backend** (dari file zip `technical-test-be`)
2.  **Server Frontend** (proyek ini)

### Terminal 1: Menjalankan Backend
1.  Buka terminal.
2.  Masuk ke folder backend: `cd path/ke/technical-test-be`
3.  Install dependensi: `npm install`
4.  Jalankan server backend: `npm run dev`
5.  Server akan berjalan di `http://localhost:8001`.

### Terminal 2: Menjalankan Frontend
1.  Buka terminal **baru**.
2.  Masuk ke folder frontend ini: `cd path/ke/product-management`
3.  Install dependensi: `npm install`
4.  Jalankan server frontend: `npm run dev`
5.  Buka browser dan kunjungi `http://localhost:3000/products`.