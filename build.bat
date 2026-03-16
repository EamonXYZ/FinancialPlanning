@echo off
chcp 65001 >nul
echo ========================================
echo   家庭财务规划系统 - 构建生产版本
echo ========================================
echo.

echo [1/2] 正在清理之前的构建文件...
if exist dist rmdir /s /q dist
echo 清理完成。
echo.

echo [2/2] 正在构建生产版本...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！请检查错误信息。
    pause
    exit /b 1
)
echo 构建成功！生产文件已生成到 dist/ 文件夹。
echo.
echo 按任意键退出...
pause >nul