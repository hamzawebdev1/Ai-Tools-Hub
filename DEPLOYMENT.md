# Production Deployment Guide (DEPLOYMENT.md)

This document outlines the exact production deployment and configuration steps for the enterprise file-processing and corporate admin platform.

## 1. Server Requirements
- **PHP**: 8.2 or higher
- **Composer**: 2.x
- **Database**: MySQL 8.0+ or MariaDB 10.4+
- **Web Server**: Nginx or Apache (Nginx recommended)

## 2. Required PHP Extensions
- `BCMath`, `Ctype`, `Fileinfo`, `JSON`, `Mbstring`, `OpenSSL`, `PDO`, `Tokenizer`, `XML`, `GD` or `Imagick` (for image processing).

## 3. Required Server Binaries (Hostinger Compatibility)
Most tools operate entirely via PHP and client-side WebAssembly/JavaScript. 
- **GD / Imagick**: Required for advanced image scaling and compression. (Supported on Hostinger Shared & VPS).
- **Poppler / Ghostscript / LibreOffice**: Optional. If available on VPS, enables advanced high-fidelity document-to-PDF rendering. If unavailable, standard client/server fallback converters are utilized.

## 4. Deployment Structure
Point your web server document root to the Laravel `public/` directory:
```text
/path-to-app/public/
```
Ensure sensitive directories (`app/`, `bootstrap/`, `config/`, `database/`, `storage/`, `vendor/`) are outside the public web root or protected.

## 5. Environment Configuration (.env)
Copy `.env.example` to `.env` and configure:
```env
APP_NAME="Enterprise File Tools"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_secure_password

FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=file
CACHE_STORE=file
```

## 6. Database Setup
1. Create a MySQL database and user.
2. Run migrations and seeders:
   ```bash
   php artisan migrate --force
   php artisan db:seed --class=AdminUserSeeder
   ```

## 7. Storage Permissions & Linking
```bash
php artisan storage:link
chmod -R 775 storage bootstrap/cache
```

## 8. Cron / Laravel Scheduler Setup
Add the following cron job on your hosting panel (Hostinger Cron Jobs) to run every minute:
```cron
* * * * * cd /path-to-app && php artisan schedule:run >> /dev/null 2>&1
```

## 9. Queue Worker Setup
For heavy file processing operations, run the queue worker:
```bash
php artisan queue:work --tries=3 --timeout=300
```
*(On shared hosting without persistent workers, set `QUEUE_CONNECTION=sync` for immediate processing).*

## 10. SSL / HTTPS & Security
- Enforce HTTPS via `.env` (`APP_URL=https://...`) and web server redirect rules.
- Ensure `APP_DEBUG=false` in production.
