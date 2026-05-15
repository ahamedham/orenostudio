Add-Type -AssemblyName System.Drawing
$root = 'C:\Users\ThinkPad\Downloads\oreno.website-4.17.2026\assets\icons'
$src  = [System.Drawing.Image]::FromFile("$root\favicon-96x96.png")
foreach ($sz in 32,16) {
  $dst = New-Object System.Drawing.Bitmap($sz, $sz)
  $g = [System.Drawing.Graphics]::FromImage($dst)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($src, 0, 0, $sz, $sz)
  $out = "$root\favicon-${sz}x${sz}.png"
  $dst.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $dst.Dispose()
  Write-Host "Wrote $out"
}
$src.Dispose()
