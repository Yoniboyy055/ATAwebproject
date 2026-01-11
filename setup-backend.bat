@echo off
REM Database setup script for Amanuel Travel (Windows)

setlocal enabledelayedexpansion
color 0A
cls

echo.
echo ========================================
echo   Amanuel Travel Backend Setup
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo [*] Creating .env.local from .env.example...
    copy .env.example .env.local >nul
    if !errorlevel! equ 0 (
        echo [+] Created .env.local
    ) else (
        echo [!] Failed to create .env.local
        exit /b 1
    )
    echo.
    echo [!] Please update .env.local with your configuration:
    echo   - DATABASE_URL (PostgreSQL connection)
    echo   - STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    echo   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
    echo.
    exit /b 1
)

echo [+] Found .env.local
echo.

REM Check Node version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [+] Node.js version: %NODE_VERSION%
echo.

REM Generate Prisma Client
echo [*] Generating Prisma Client...
call npm run prisma:generate
if !errorlevel! equ 0 (
    echo [+] Prisma Client generated
) else (
    echo [!] Failed to generate Prisma Client
    exit /b 1
)
echo.

REM Push schema to database
echo [*] Pushing schema to database...
call npm run db:push
if !errorlevel! equ 0 (
    echo [+] Schema pushed to database
) else (
    echo [!] Database push failed. Make sure:
    echo   1. PostgreSQL is running
    echo   2. DATABASE_URL is correct in .env.local
    echo   3. Database exists and is accessible
    exit /b 1
)
echo.

REM Seed database
set /p SEED="Seed database with sample data? (y/n): "
if /i "%SEED%"=="y" (
    echo [*] Seeding database...
    call npm run db:seed
    if !errorlevel! equ 0 (
        echo [+] Database seeded with sample data
    ) else (
        echo [!] Failed to seed database
    )
    echo.
)

echo.
echo ========================================
echo   [+] Backend Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo   1. Start development server: npm run dev
echo   2. View database: npx prisma studio
echo   3. Read API docs: API_REFERENCE.md
echo   4. Check setup guide: DATABASE_SETUP.md
echo.
echo Useful Links:
echo   - API Docs: API_REFERENCE.md
echo   - Setup Guide: DATABASE_SETUP.md
echo   - Prisma Docs: https://www.prisma.io/docs/
echo   - Stripe Docs: https://stripe.com/docs
echo   - NextAuth Docs: https://next-auth.js.org/
echo.
pause

endlocal
