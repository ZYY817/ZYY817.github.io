Add-Type -AssemblyName System.Drawing
$root = "C:\Users\v_yuqqisun\yuqi-site"
$img  = Join-Path $root "assets\img"
New-Item -ItemType Directory -Force $img | Out-Null

$src = [System.Drawing.Bitmap]::FromFile((Join-Path $root "ref\yuqi-logo.png"))
$w = $src.Width; $h = $src.Height
$minX = $w; $minY = $h; $maxX = 0; $maxY = 0
for ($y = 0; $y -lt $h; $y += 2) {
  for ($x = 0; $x -lt $w; $x += 2) {
    $p = $src.GetPixel($x, $y)
    $ink = $p.A * (255 - (($p.R + $p.G + $p.B) / 3)) / 255
    if ($ink -gt 128) {
      if ($x -lt $minX) { $minX = $x }; if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }; if ($y -gt $maxY) { $maxY = $y }
    }
  }
}
$pad = 8
$minX = [Math]::Max(0, $minX - $pad); $minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($w - 1, $maxX + $pad); $maxY = [Math]::Min($h - 1, $maxY + $pad)
$cw = $maxX - $minX + 1; $ch = $maxY - $minY + 1

function Make-Logo($r, $g, $b, $name) {
  $out = New-Object System.Drawing.Bitmap $cw, $ch, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $ch; $y++) {
    for ($x = 0; $x -lt $cw; $x++) {
      $p = $src.GetPixel($x + $minX, $y + $minY)
      $lum = ($p.R + $p.G + $p.B) / 3
      $a = [int][Math]::Max(0, [Math]::Min(255, $p.A * (255 - $lum) / 255))
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $r, $g, $b))
    }
  }
  $out.Save((Join-Path $img $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
}
Make-Logo 14 20 20 "logo-dark.png"
Make-Logo 255 255 255 "logo-light.png"
$src.Dispose()

foreach ($f in "overview-v0.1.1.png", "game-optimization-v0.1.1.png") {
  Copy-Item (Join-Path $root "ref\$f") (Join-Path $img $f) -Force
}
"logo bbox: $minX,$minY ${cw}x${ch}"
Get-ChildItem $img | Select-Object Name, Length
