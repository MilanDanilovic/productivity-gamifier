# Setup script for Gamify Productivity
# Run this script to create necessary .env files

Write-Host "Setting up environment files..." -ForegroundColor Green

# Create backend .env file
$apiEnvPath = "apps\api\.env"
if (-not (Test-Path $apiEnvPath)) {
    $apiEnvContent = @"
MONGO_URI=mongodb://localhost:27017/gamify
JWT_SECRET=change_me_to_a_secure_secret
JWT_EXPIRES=15m
REFRESH_EXPIRES=7d
PORT=4000
"@
    Set-Content -Path $apiEnvPath -Value $apiEnvContent
    Write-Host "✓ Created $apiEnvPath" -ForegroundColor Green
} else {
    Write-Host "✓ $apiEnvPath already exists" -ForegroundColor Yellow
}

# Create frontend .env.local file
$webEnvPath = "apps\web\.env.local"
if (-not (Test-Path $webEnvPath)) {
    $webEnvContent = @"
NEXT_PUBLIC_API_URL=http://localhost:4000
"@
    Set-Content -Path $webEnvPath -Value $webEnvContent
    Write-Host "✓ Created $webEnvPath" -ForegroundColor Green
} else {
    Write-Host "✓ $webEnvPath already exists" -ForegroundColor Yellow
}

Write-Host "`nEnvironment files setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start MongoDB: docker-compose up -d" -ForegroundColor White
Write-Host "2. Seed database: cd apps\api && npm run seed" -ForegroundColor White
Write-Host "3. Start dev servers: npm run dev" -ForegroundColor White

