@echo off
chcp 65001 >nul
echo ========================================
echo   家庭财务规划系统 - 预览生产版本
echo ========================================
echo.

echo 检查是否已构建...
if not exist dist (
    echo 未找到 dist/ 文件夹，需要先构建。
    echo 正在自动构建...
    call build.bat
    if %errorlevel% neq 0 (
        echo 构建失败，无法预览。
        pause
        exit /b 1
    )
)

echo 启动预览服务器并打开浏览器...
start "Vite Preview Server" cmd /k "npm run preview"
echo 等待预览服务器启动...
timeout /t 3 /nobreak >nul
start http://localhost:4173
echo 浏览器已打开，访问 http://localhost:4173
echo.
echo 提示：预览服务器运行在新窗口，关闭该窗口即可停止预览。
echo 按任意键退出此脚本...
pause >nul