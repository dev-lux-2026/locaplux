Write-Host "=== LOCAPLUX AUDIT START ===" -ForegroundColor Cyan

# 1. Check critical files
Write-Host "`n[1] Checking critical files..."
$criticalFiles = @(
    "next.config.js",
    "package.json",
    "prisma/schema.prisma",
    "lib/prisma.ts",
    "lib/terms.ts",
    "app/api/auth/[...nextauth]/route.ts",
    "app/api/user/accept-terms/route.ts",
    "app/api/user/accept-partner-terms/route.ts",
    "app/legal/accept-terms/page.tsx",
    "app/legal/accept-partner-terms/page.tsx"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "OK  $file" -ForegroundColor Green
    } else {
        Write-Host "MISSING  $file" -ForegroundColor Red
    }
}

# 2. Check environment variables
Write-Host "`n[2] Checking environment variables..."
$envVars = @(
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "RESEND_API_KEY",
    "NEXT_PUBLIC_APP_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "SUPABASE_PROJECT_ID"
)

foreach ($var in $envVars) {
    $value = [System.Environment]::GetEnvironmentVariable($var)
    if ($value -and $value.Trim() -ne "") {
        Write-Host "OK  $var" -ForegroundColor Green
    } else {
        Write-Host "MISSING  $var" -ForegroundColor Red
    }
}

# 3. Prisma validation
Write-Host "`n[3] Checking Prisma..."
try {
    npx prisma validate
    Write-Host "Prisma OK" -ForegroundColor Green
} catch {
    Write-Host "Prisma ERROR" -ForegroundColor Red
}

# 4. Next.js build
Write-Host "`n[4] Checking Next.js build..."
try {
    npm run build
    Write-Host "Next.js build OK" -ForegroundColor Green
} catch {
    Write-Host "Next.js build ERROR" -ForegroundColor Red
}

# 5. Supabase ping
Write-Host "`n[5] Checking Supabase..."
$projectId = [System.Environment]::GetEnvironmentVariable("SUPABASE_PROJECT_ID")
if ($projectId) {
    try {
        $url = "https://$projectId.supabase.co"
        Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 | Out-Null
        Write-Host "Supabase reachable" -ForegroundColor Green
    } catch {
        Write-Host "Supabase unreachable" -ForegroundColor Red
    }
} else {
    Write-Host "SUPABASE_PROJECT_ID missing" -ForegroundColor Red
}

# 6. Stripe key validation
Write-Host "`n[6] Checking Stripe..."
$stripeKey = [System.Environment]::GetEnvironmentVariable("STRIPE_SECRET_KEY")
if ($stripeKey) {
    try {
        Invoke-WebRequest -Uri "https://api.stripe.com/v1/charges" `
            -Headers @{Authorization="Bearer $stripeKey"} `
            -Method GET -TimeoutSec 5 | Out-Null
        Write-Host "Stripe key OK" -ForegroundColor Green
    } catch {
        Write-Host "Stripe key INVALID" -ForegroundColor Red
    }
} else {
    Write-Host "STRIPE_SECRET_KEY missing" -ForegroundColor Red
}

Write-Host "`n=== LOCAPLUX AUDIT COMPLETE ===" -ForegroundColor Cyan
