Add-Type -AssemblyName System.Drawing
$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background #050505
$bg = [System.Drawing.Color]::FromArgb(255, 5, 5, 5)
$g.Clear($bg)

# Subtle off-center radial-ish glows (two soft ellipses) for depth
$glow1 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(8, 255, 255, 255))
$g.FillEllipse($glow1, -200, -150, 1000, 700)
$glow2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(6, 255, 255, 255))
$g.FillEllipse($glow2, 600, 250, 900, 600)
$glow1.Dispose(); $glow2.Dispose()

# Pick the heaviest installed font: Montserrat 700 if available, else Arial Black
$family = $null
try {
  $family = New-Object System.Drawing.FontFamily('Montserrat')
} catch {
  try { $family = New-Object System.Drawing.FontFamily('Arial Black') }
  catch { $family = New-Object System.Drawing.FontFamily('Arial') }
}
Write-Host "Using font family: $($family.Name)"

# ── Top-right corner label
$cornerFont  = New-Object System.Drawing.Font($family, 11.0, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$cornerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 102, 102, 102))
$cornerText  = "BRAND ARCHITECTURE"
$cornerSize  = $g.MeasureString($cornerText, $cornerFont)
$g.DrawString($cornerText, $cornerFont, $cornerBrush, [single]($W - 56 - $cornerSize.Width), [single]44)

# ── Wordmark "ØRENO STUDIO" centered
# Use 96px so the longer "STUDIO" version fits comfortably
$wmFont  = New-Object System.Drawing.Font($family, 110.0, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$wmBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$wmText  = "ORENO STUDIO"   # System fonts often lack Ø — we render the slash overlay manually below
$wmSize  = $g.MeasureString($wmText, $wmFont)
$wmX     = ($W - $wmSize.Width) / 2
$wmY     = ($H / 2) - ($wmSize.Height / 2) - 30
$g.DrawString($wmText, $wmFont, $wmBrush, [single]$wmX, [single]$wmY)

# Manual Ø: draw a slash through the leading "O"
# Measure width of just "O" so we know where to place the slash
$oSize = $g.MeasureString("O", $wmFont)
$slashPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White, 7.0)
$slashPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$slashPen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
$ox = $wmX + 18
$oy = $wmY + 22
$ow = $oSize.Width - 36
$oh = $wmSize.Height - 44
$g.DrawLine($slashPen, [single]($ox + $ow*0.18), [single]($oy + $oh*0.78), [single]($ox + $ow*0.82), [single]($oy + $oh*0.22))
$slashPen.Dispose()

# ── Tagline
$tagFont  = New-Object System.Drawing.Font($family, 26.0, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$tagBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 136, 136, 136))
$mid      = [char]0x00B7
$tagText  = "Brand Architecture   $mid   Colombo, Sri Lanka"
$tagSize  = $g.MeasureString($tagText, $tagFont)
$tagX     = ($W - $tagSize.Width) / 2
$tagY     = $wmY + $wmSize.Height + 4
$g.DrawString($tagText, $tagFont, $tagBrush, [single]$tagX, [single]$tagY)

# ── Faint horizontal rule near bottom
$rulePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(46, 255, 255, 255), 1.0)
$g.DrawLine($rulePen, [single]56, [single]($H - 96), [single]($W - 56), [single]($H - 96))
$rulePen.Dispose()

# ── Bottom-left: oreno.lk
$urlFont  = New-Object System.Drawing.Font($family, 22.0, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$urlBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 85, 85, 85))
$g.DrawString("oreno.lk", $urlFont, $urlBrush, [single]56, [single]($H - 80))

# ── Bottom-right: small mark
$markFont  = New-Object System.Drawing.Font($family, 14.0, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$markBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 85, 85, 85))
$markText  = "EST. 2025"
$markSize  = $g.MeasureString($markText, $markFont)
$g.DrawString($markText, $markFont, $markBrush, [single]($W - 56 - $markSize.Width), [single]($H - 76))

# ── Save as JPEG, quality 92
$out = 'C:\Users\ThinkPad\Downloads\oreno.website-4.17.2026\assets\og-image.jpg'
$jpgEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams  = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)
$bmp.Save($out, $jpgEncoder, $encParams)

$g.Dispose(); $bmp.Dispose()
Write-Host "Wrote $out  ($([math]::Round((Get-Item $out).Length/1KB,1)) KB, ${W}x${H})"
