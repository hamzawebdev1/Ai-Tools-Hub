# Maintenance & Operations Guide (MAINTENANCE.md)

This document provides day-to-day operational and maintenance procedures for the platform administrators.

## 1. Updating Dependencies & Code
```bash
git pull origin main
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 2. Clearing Cache & Optimization
```bash
php artisan optimize:clear
php artisan optimize
```

## 3. Managing Queues & Failed Jobs
- **Inspect Failed Jobs**: `php artisan queue:failed`
- **Retry Failed Job**: `php artisan queue:retry {id}`
- **Flush Failed Jobs**: `php artisan queue:forget {id}`

## 4. Inspecting Logs
- Application logs are located at `storage/logs/laravel.log`.
- Admin panel error log dashboard provides a secure interface for monitoring system anomalies.

## 5. Cleaning Storage & Temporary Uploads
The automated scheduler handles temporary file cleanup. Manual cleanup can be triggered via:
```bash
php artisan storage:clear-temp
```

## 6. Creating a New Admin User
Run the artisan command or use the Admin Panel Users section:
```bash
php artisan admin:create --email=admin@example.com --password=SecurePassword --role=super-admin
```

## 7. Database Backups
Schedule daily database backups using mysqldump:
```bash
mysqldump -u username -p database_name > /path/to/backups/db_$(date +%F).sql
```
