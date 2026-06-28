@echo off
chcp 65001 >nul
title JadwalAuto Installer
color 0A

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║        JADWALAUTO INSTALLER              ║
echo  ║    Sistem Penjadwalan Otomatis Sekolah   ║
echo  ╚══════════════════════════════════════════╝
echo.

:: ============================================
:: CEK NODE.JS
:: ============================================
echo [1/7] Mengecek Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [ERROR] Node.js tidak ditemukan!
    echo  Silakan install Node.js dari: https://nodejs.org
    echo  Pilih versi LTS, lalu jalankan installer ini lagi.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo  ✓ Node.js %NODE_VER% terdeteksi

:: ============================================
:: CEK NPM
:: ============================================
echo [2/7] Mengecek npm...
npm -v >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [ERROR] npm tidak ditemukan!
    echo  Silakan install ulang Node.js dari: https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo  ✓ npm %NPM_VER% terdeteksi

:: ============================================
:: CEK MYSQL
:: ============================================
echo [3/7] Mengecek MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [WARNING] MySQL CLI tidak ditemukan di PATH.
    echo  Pastikan MySQL sudah terinstall dan berjalan di port 3306.
    echo  Download: https://dev.mysql.com/downloads/installer/
    echo.
    echo  Lanjutkan? (Y/N)
    set /p MYSQL_CONTINUE=
    if /i not "%MYSQL_CONTINUE%"=="Y" (
        echo  Installer dibatalkan.
        pause
        exit /b 1
    )
) else (
    echo  ✓ MySQL terdeteksi
)

:: ============================================
:: INSTALL DEPENDENCIES SERVER
:: ============================================
echo.
echo [4/7] Install dependencies server...
echo  Mohon tunggu, proses ini membutuhkan waktu...
echo.
cd server
call npm install
if errorlevel 1 (
    echo.
    echo  [ERROR] Gagal install dependencies server!
    echo.
    pause
    exit /b 1
)
echo  ✓ Dependencies server terinstall
cd ..

:: ============================================
:: INSTALL DEPENDENCIES CLIENT
:: ============================================
echo.
echo [5/7] Install dependencies client...
echo  Mohon tunggu, proses ini membutuhkan waktu...
echo.
cd client
call npm install
if errorlevel 1 (
    echo.
    echo  [ERROR] Gagal install dependencies client!
    echo.
    pause
    exit /b 1
)
echo  ✓ Dependencies client terinstall
cd ..

:: ============================================
:: SETUP DATABASE
:: ============================================
echo.
echo [6/7] Setup database...

:: Buat database jika belum ada
echo  Membuat database jadwal_mengajar...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS jadwal_mengajar;" 2>nul
if errorlevel 1 (
    echo.
    echo  [WARNING] Tidak bisa membuat database otomatis.
    echo  Pastikan MySQL berjalan dan root tidak punya password.
    echo  Atau buat database manual:
    echo    mysql -u root -p
    echo    CREATE DATABASE jadwal_mengajar;
    echo.
    echo  Lanjutkan? (Y/N)
    set /p DB_CONTINUE=
    if /i not "%DB_CONTINUE%"=="Y" (
        echo  Installer dibatalkan.
        pause
        exit /b 1
    )
) else (
    echo  ✓ Database jadwal_mengajar siap
)

:: Jalankan migrasi
echo  Menjalankan migrasi database...
cd server
call npx tsx src/db/migrate.ts
if errorlevel 1 (
    echo.
    echo  [WARNING] Migrasi gagal. Database mungkin sudah ter-setup.
    echo.
)
cd ..

:: ============================================
:: SEED DATA
:: ============================================
echo.
echo [7/7] Mengisi data awal...
echo  PERINGATAN: Ini akan mereset semua data yang ada!
echo.
echo  Isi data awal? (Y/N)
set /p SEED_CONFIRM=
if /i "%SEED_CONFIRM%"=="Y" (
    cd server
    call npm run db:seed
    cd ..
    echo  ✓ Data awal berhasil diisi
) else (
    echo  - Skip pengisian data awal
)

:: ============================================
:: SELESAI
:: ============================================
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║        INSTALASI SELESAI!                ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  Untuk menjalankan aplikasi, buka 2 terminal:
echo.
echo  Terminal 1 (Server):
echo    cd server
echo    npm run dev
echo.
echo  Terminal 2 (Client):
echo    cd client
echo    npm run dev
echo.
echo  Buka browser: http://localhost:5173
echo  Login: admin / admin123
echo.
echo  ══════════════════════════════════════════
echo.

:: Tanya apakah mau menjalankan sekarang
echo  Jalankan sekarang? (Y/N)
set /p RUN_NOW=
if /i "%RUN_NOW%"=="Y" (
    echo.
    echo  Memulai server...
    start "JadwalAuto Server" cmd /k "cd server && npm run dev"
    timeout /t 3 /nobreak >nul
    echo  Memulai client...
    start "JadwalAuto Client" cmd /k "cd client && npm run dev"
    timeout /t 3 /nobreak >nul
    echo  Membuka browser...
    start http://localhost:5173
    echo.
    echo  Aplikasi berhasil dijalankan!
    echo  Tutup jendela ini atau tekan tombol apapun untuk keluar.
) else (
    echo.
    echo  Untuk menjalankan, jalankan perintah di atas.
)

echo.
pause
