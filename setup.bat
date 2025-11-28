@echo off
REM Next.js Migration Setup Script for Windows

echo 🚀 Starting Next.js Migration Setup...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local from template...
    copy .env.local.example .env.local
    echo ⚠️  Please edit .env.local and add your GEMINI_API_KEY
)

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Edit .env.local with your API credentials
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see MIGRATION.md
