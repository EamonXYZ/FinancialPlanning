@echo off
chcp 65001 >nul
echo ========================================
echo   家庭财务规划系统 - 一键构建和预览
echo ========================================
echo.

echo [1/3] 正在清理之前的构建文件...
if exist dist rmdir /s /q dist
echo 清理完成。
echo.

echo [2/3] 正在构建生产版本...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！请检查错误信息。
    pause
    exit /b 1
)
echo 构建成功！生产文件已生成到 dist/ 文件夹。
echo.

echo [3/3] 启动预览服务器并打开浏览器...
start "Vite Preview Server" cmd /k "npm run preview"
echo 等待预览服务器启动...
timeout /t 3 /nobreak >nul
start http://localhost:4173
echo 浏览器已打开，访问 http://localhost:4173
echo.
echo 提示：预览服务器运行在新窗口，关闭该窗口即可停止预览。
echo 按任意键退出此脚本...
pause >nul