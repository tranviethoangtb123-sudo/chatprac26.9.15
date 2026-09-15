# ============================================================================
#  生成 App 图标：白底 + 黑色 "Chat Prac" 文字
#  ---------------------------------------------------------------------------
#  说明：需要真正的字体渲染，所以用 Windows 自带的 GDI+（System.Drawing）。
#        这个脚本只能在 Windows 上跑；生成好的 PNG 已经提交进仓库，
#        平时不需要重新生成（GitHub Actions 跑在 Linux 上，不做这一步）。
#  用法：pwsh -File tools/build-icons.ps1
#  输出：assets/icons/*.png
# ============================================================================

Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\assets\icons"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$fontFamily = "Arial"
$text = "Chat`nPrac"     # 两行，小尺寸图标下比一行更清楚

function New-AppIcon {
    param(
        [int]$Size,
        [string]$File,
        [double]$Scale,          # 文字宽度占画布的比例
        [string]$Family = $fontFamily
    )

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::White)

    # 二分查找合适的字号：让文字宽度正好占到 $Scale
    $lo = 4
    $hi = $Size
    while ($lo -lt $hi) {
        $mid = [int](($lo + $hi + 1) / 2)
        $probe = New-Object System.Drawing.Font $Family, $mid, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
        $m = $g.MeasureString($text, $probe)
        if ($m.Width -le $Size * $Scale) { $lo = $mid } else { $hi = $mid - 1 }
        $probe.Dispose()
    }

    $font = New-Object System.Drawing.Font $Family, $lo, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
    $fmt = New-Object System.Drawing.StringFormat
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
    $g.DrawString($text, $font, [System.Drawing.Brushes]::Black, $rect, $fmt)

    $g.Dispose()
    $font.Dispose()
    $fmt.Dispose()

    $path = Join-Path $outDir $File
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    "{0,-26} {1,4}x{1,-4} 字号 {2}  {3:N1} KB" -f $File, $Size, $lo, ((Get-Item $path).Length / 1KB)
}

# 普通图标：白底 + 文字（Android 会自动按需裁切/圆角）
New-AppIcon -Size 192 -File "icon-192.png"           -Scale 0.74
New-AppIcon -Size 512 -File "icon-512.png"           -Scale 0.74
# maskable：图案要落在中心安全区内，所以缩小一点
New-AppIcon -Size 512 -File "icon-maskable-512.png"  -Scale 0.56
# iOS 主屏幕图标：系统自己会切圆角
New-AppIcon -Size 180 -File "apple-touch-icon.png"   -Scale 0.74
# 浏览器标签页图标
New-AppIcon -Size 32  -File "favicon-32.png"         -Scale 0.92

"`n图标已生成到 assets/icons/"
