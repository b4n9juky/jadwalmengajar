# JadwalAuto Installer - PowerShell Version
# Jalankan: powershell -ExecutionPolicy Bypass -File install.ps1

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-Header {
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║        JADWALAUTO INSTALLER              ║" -ForegroundColor Cyan
    Write-Host "  ║    Sistem Penjadwalan Otomatis Sekolah   ║" -ForegroundColor Cyan
    Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step($step, $total, $msg) {
    Write-Host "[$step/$total] $msg" -ForegroundColor Yellow
}

function Write-OK($msg) {
    Write-Host "  ✓ $msg" -ForegroundColor Green
}

function Write-Error($msg) {
    Write-Host "  [ERROR] $msg" -ForegroundColor Red
}

function Write-Warning($msg) {
    Write-Host "  [WARNING] $msg" -ForegroundColor Yellow
}

function Test-Command($cmd) {
    try {
        & $cmd --version 2>$null | Out-Null
        return $true
    } catch {
        return $false
    }
}

# ============================================
# MAIN
# ============================================
Write-Header

# Step 1: Check Node.js
Write-Step 1 7 "Mengecek Node.js..."
try {
    $nodeVer = & node -v 2>$null
    Write-OK "Node.js $nodeVer terdeteksi"
} catch {
    Write-Error "Node.js tidak ditemukan!"
    Write-Host "  Silakan install Node.js dari: https://nodejs.org" -ForegroundColor White
    Write-Host "  Pilih versi LTS, lalu jalankan installer ini lagi." -ForegroundColor White
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

# Step 2: Check npm
Write-Step 2 7 "Mengecek npm..."
try {
    $npmVer = & npm -v 2>$null
    Write-OK "npm $npmVer terdeteksi"
} catch {
    Write-Error "npm tidak ditemukan!"
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

# Step 3: Check MySQL
Write-Step 3 7 "Mengecek MySQL..."
$mysqlFound = $false
try {
    $mysqlVer = & mysql --version 2>$null
    $mysqlFound = $true
    Write-OK "MySQL terdeteksi"
} catch {
    Write-Warning "MySQL CLI tidak ditemukan di PATH."
    Write-Host "  Pastikan MySQL sudah terinstall dan berjalan di port 3306." -ForegroundColor White
    Write-Host "  Download: https://dev.mysql.com/downloads/installer/" -ForegroundColor White
    $continue = Read-Host "  Lanjutkan? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Host "  Installer dibatalkan." -ForegroundColor Red
        exit 1
    }
}

# Step 4: Install server dependencies
Write-Step 4 7 "Install dependencies server..."
Write-Host "  Mohon tunggu, proses ini membutuhkan waktu..." -ForegroundColor Gray
Push-Location server
try {
    & npm install 2>$null
    Write-OK "Dependencies server terinstall"
} catch {
    Write-Error "Gagal install dependencies server!"
    Pop-Location
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}
Pop-Location

# Step 5: Install client dependencies
Write-Step 5 7 "Install dependencies client..."
Write-Host "  Mohon tunggu, proses ini membutuhkan waktu..." -ForegroundColor Gray
Push-Location client
try {
    & npm install 2>$null
    Write-OK "Dependencies client terinstall"
} catch {
    Write-Error "Gagal install dependencies client!"
    Pop-Location
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}
Pop-Location

# Step 6: Setup database
Write-Step 6 7 "Setup database..."
try {
    & mysql -u root -e "CREATE DATABASE IF NOT EXISTS jadwal_mengajar;" 2>$null
    Write-OK "Database jadwal_mengajar siap"
} catch {
    Write-Warning "Tidak bisa membuat database otomatis."
    Write-Host "  Pastikan MySQL berjalan dan root tidak punya password." -ForegroundColor White
    Write-Host "  Atau buat database manual:" -ForegroundColor White
    Write-Host "    mysql -u root -p" -ForegroundColor Gray
    Write-Host "    CREATE DATABASE jadwal_mengajar;" -ForegroundColor Gray
    $continue = Read-Host "  Lanjutkan? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Host "  Installer dibatalkan." -ForegroundColor Red
        exit 1
    }
}

# Run migrations
Write-Host "  Menjalankan migrasi database..." -ForegroundColor Gray
Push-Location server
try {
    & npx tsx src/db/migrate.ts 2>$null
    Write-OK "Migrasi database selesai"
} catch {
    Write-Warning "Migrasi gagal. Database mungkin sudah ter-setup."
}
Pop-Location

# Step 7: Seed data
Write-Step 7 7 "Mengisi data awal..."
Write-Host "  PERINGATAN: Ini akan mereset semua data yang ada!" -ForegroundColor Yellow
$seed = Read-Host "  Isi data awal? (Y/N)"
if ($seed -eq "Y" -or $seed -eq "y") {
    Push-Location server
    & npm run db:seed
    Pop-Location
    Write-OK "Data awal berhasil diisi"
} else {
    Write-Host "  - Skip pengisian data awal" -ForegroundColor Gray
}

# Done
Write-Host ""
Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "  ║        INSTALASI SELESAI!                ║" -ForegroundColor Green
Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Untuk menjalankan aplikasi, buka 2 terminal:" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 1 (Server):" -ForegroundColor Cyan
Write-Host "    cd server" -ForegroundColor Gray
Write-Host "    npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  Terminal 2 (Client):" -ForegroundColor Cyan
Write-Host "    cd client" -ForegroundColor Gray
Write-Host "    npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  Buka browser: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Login: admin / admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ══════════════════════════════════════════" -ForegroundColor Gray
Write-Host ""

$run = Read-Host "  Jalankan sekarang? (Y/N)"
if ($run -eq "Y" -or $run -eq "y") {
    Write-Host ""
    Write-Host "  Memulai server..." -ForegroundColor Gray
    Start-Process cmd -ArgumentList "/k", "cd server && npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 3
    Write-Host "  Memulai client..." -ForegroundColor Gray
    Start-Process cmd -ArgumentList "/k", "cd client && npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 3
    Write-Host "  Membuka browser..." -ForegroundColor Gray
    Start-Process "http://localhost:5173"
    Write-Host ""
    Write-Host "  Aplikasi berhasil dijalankan!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  Untuk menjalankan, jalankan perintah di atas." -ForegroundColor Gray
}

Write-Host ""
Read-Host "Tekan Enter untuk keluar"
