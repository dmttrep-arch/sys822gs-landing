@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0ensure_public.ps1"
if errorlevel 1 pause
