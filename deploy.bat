@echo off
chcp 65001 >nul
echo ==========================================
echo   VEXON Studio - deploy to Cloudflare Pages
echo ==========================================
echo.
cd /d "%~dp0"
call wrangler pages deploy . --project-name=vexon-studio --commit-dirty=true
echo.
echo ==========================================
echo   Done. Press any key to close.
echo ==========================================
pause >nul
