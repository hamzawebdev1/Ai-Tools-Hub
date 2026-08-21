# ToolsHub Laravel Deployment & Hostinger Installation Guide

This production-grade Laravel 11/12 application has been architected to run out of the box on standard shared hosting (e.g. Hostinger, cPanel, SiteGround) without VPS or specialized daemon requirements.

---

## 1. Hosting Requirements
* **PHP:** >= 8.2 (8.2 or 8.3 recommended)
* **PHP Extensions:** `pdo_mysql`, `gd`, `mbstring`, `fileinfo`, `openssl`, `curl`, `json`
* **Database:** MySQL 8.0+ or MariaDB 10.4+
* **Disk Space:** Standard web hosting directory structure (`public_html` or domain root)

---

## 2. Fast Deployment Steps

### Step 1: Upload Files
1. Upload the entire contents of the `/laravel` directory to your hosting home directory (e.g. `/home/u123456789/laravel_app` or above `public_html`).
2. Point your website document root to `/laravel/public` (or move the contents of `public/` directly into `public_html/` and update `index.php` paths).

### Step 2: Configure Environment
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update your MySQL database credentials:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=u123456789_toolshub
   DB_USERNAME=u123456789_user
   DB_PASSWORD=YourStrongDatabasePasswordHere
   ```

### Step 3: Run Database Migrations and Seeders
From the SSH terminal or Hostinger terminal:
```bash
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
```

This will automatically create all tables and seed:
* System Roles and Permissions
* Default Administrative Users:
  * Super Admin: `hamza.web.dev5324@gmail.com` / `Admin@ToolsHub2026!`
  * Platform Admin: `admin@toolshub.io` / `AdminSecurePassword123!`
* 10 Core Production Tools (PDF, Image, JSON, Text, Hash, Diff, QR, SQL, SEO)
* Default System Settings

### Step 4: Configure Hostinger Scheduled Tasks (Cron)
In Hostinger hPanel -> **Advanced** -> **Cron Jobs**:
Add the following command to run **Every Minute** (`* * * * *`):
```bash
/usr/bin/php /home/u123456789/domains/yourdomain.com/laravel/artisan schedule:run >> /dev/null 2>&1
```

This automatically triggers:
* Expired temporary file cleanup (`tools:cleanup-temp`)
* Scheduled jobs and maintenance tasks

---

## 3. Architecture Overview

```
laravel/
├── app/
│   ├── Console/Commands/       # Cron commands (tools:cleanup-temp, tools:sync, tools:health)
│   ├── Helpers/helpers.php     # Global helper functions (setting(), format_bytes())
│   ├── Http/
│   │   ├── Controllers/        # Public, Admin, API, Auth, and File Controllers
│   │   ├── Middleware/         # Security headers, Admin auth, Token validation
│   │   └── Requests/           # Strict validation form requests
│   ├── Jobs/                   # Asynchronous and background queue jobs
│   ├── Models/                 # Eloquent models with RBAC relations
│   └── Services/
│       ├── Analytics/          # Fast, local analytics engine
│       ├── Security/           # Path traversal and executable blacklist validator
│       ├── Settings/           # System settings cache manager
│       ├── Storage/            # Secure temporary storage & AES-256 tokens
│       └── ToolEngine/         # Modular tool processor interface & concrete classes
├── config/                     # Configs for tools, settings, storage
├── database/
│   ├── migrations/             # 8 migration files covering all schema tables
│   └── seeders/                # Seeders for roles, tools, users, settings
├── resources/views/            # Blade templates for public catalog, tool pages, admin
└── routes/                     # web.php, api.php, console.php
```

---

## 4. Default Admin Login Credentials
* **URL:** `https://yourdomain.com/login`
* **Email:** `hamza.web.dev5324@gmail.com`
* **Password:** `Admin@ToolsHub2026!`
