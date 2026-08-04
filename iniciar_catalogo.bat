@echo off
echo ============================================
echo   Catalogo de Frontends - Servidor Local
echo ============================================
echo.
echo Abrindo o catalogo em http://localhost:8888
echo Pressione Ctrl+C para parar o servidor.
echo.
start http://localhost:8888
npx -y serve -l 8888 -s .
