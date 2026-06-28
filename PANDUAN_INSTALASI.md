# Panduan Instalasi JadwalAuto - Windows

## Persyaratan Sistem

| Komponen | Versi Minimum |
|----------|---------------|
| Node.js | v18.x atau lebih baru |
| npm | v9.x atau lebih baru |
| MySQL | 8.0 atau lebih baru |
| Windows | 10/11 (64-bit) |

## Langkah Instalasi

### 1. Install Node.js

Download dan install Node.js dari: https://nodejs.org

Pilih versi **LTS** (Long Term Support). Installer sudah termasuk npm.

Verifikasi instalasi:
```bash
node -v
npm -v
```

### 2. Install MySQL

Download dan install MySQL dari: https://dev.mysql.com/downloads/installer/

Saat instalasi:
- Pilih **Developer Default** atau **Server only**
- Set password root (ingat password ini)
- Pastikan MySQL berjalan di port **3306**

Verifikasi MySQL berjalan:
```bash
mysql -u root -p
```

### 3. Clone / Download Project

```bash
git clone https://github.com/username/jadwalauto.git
cd jadwalauto
```

Atau download ZIP dari GitHub dan extract.

### 4. Jalankan Installer (Otomatis)

```bash
install.bat
```

Installer akan:
- Membuat database `jadwal_mengajar`
- Install dependencies client dan server
- Menjalankan migrasi database
- Mengisi data awal (seed)

### 5. Jalankan Aplikasi

Buka **2 terminal** secara terpisah:

**Terminal 1 - Server (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 - Client (Frontend):**
```bash
cd client
npm run dev
```

### 6. Buka Browser

Akses aplikasi di: **http://localhost:5173**

Login dengan:
- Username: `admin`
- Password: `admin123`

---

## Konfigurasi Manual

### File `.env` (server/.env)

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=jadwal_mengajar
PORT=3000
```

Ubah `DB_PASSWORD` jika MySQL root punya password.

### Port yang Digunakan

| Service | Port |
|---------|------|
| Frontend (Vite) | 5173 |
| Backend (Express) | 3000 |
| MySQL | 3306 |

---

## Perintah yang Tersedia

### Server (`cd server`)

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan server dalam mode development |
| `npm run build` | Build server untuk production |
| `npm run start` | Jalankan server production |
| `npm run db:generate` | Generate migrasi database |
| `npm run db:migrate` | Jalankan migrasi database |
| `npm run db:seed` | Isi data awal (reset semua data) |

### Client (`cd client`)

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan client dalam mode development |
| `npm run build` | Build client untuk production |
| `npm run preview` | Preview hasil build |

---

## Troubleshooting

### Error: Port sudah digunakan

```bash
# Cari proses yang menggunakan port
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Hapus proses (ganti PID dengan angka yang ditemukan)
taskkill /PID <PID> /F
```

### Error: Access Denied (MySQL)

```bash
mysql -u root -p
# Masukkan password, lalu:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

### Error: Database sudah ada

```bash
mysql -u root -p
CREATE DATABASE IF NOT EXISTS jadwal_mengajar;
```

### Error: Module not found

```bash
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install
```

### Server tidak bisa start

1. Pastikan MySQL berjalan
2. Pastikan port 3000 belum digunakan
3. Cek file `server/.env` untuk konfigurasi database

---

## Build untuk Production

### Server

```bash
cd server
npm run build
npm run start
```

### Client

```bash
cd client
npm run build
```

Hasil build ada di `client/dist/`. Deploy folder ini ke web server (Nginx, Apache, dll).

---

## Struktur Project

```
jadwalauto/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Komponen UI
│   │   ├── contexts/      # React context
│   │   ├── hooks/         # Custom hooks (TanStack Query)
│   │   ├── pages/         # Halaman aplikasi
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                 # Backend Express
│   ├── src/
│   │   ├── db/            # Database schema & migrations
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic (scheduler)
│   ├── drizzle/           # SQL migrations
│   └── package.json
├── install.bat             # Installer Windows
└── PANDUAN_INSTALASI.md    # Dokumentasi ini
```

---

## Fitur Aplikasi

- **Dashboard** - Ringkasan data sekolah
- **Guru** - CRUD data guru + import Excel
- **Mata Pelajaran** - CRUD data mapel + import Excel
- **Kelas** - CRUD data kelas + import Excel
- **Ruangan** - CRUD data ruangan + import Excel
- **Slot Waktu** - Pengaturan jam pelajaran per hari
- **Ketersediaan Guru** - Jam kerja guru per hari
- **Pengajaran** - Mapping guru-mapel-kelas
- **Jadwal** - Generate jadwal otomatis + drag & drop + export Excel
- **Tahun Ajaran** - Kelola tahun ajaran & semester
- **Pengaturan** - Jenis sekolah (negeri/swasta)
