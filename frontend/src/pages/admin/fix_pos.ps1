$path = "c:\Users\leanp\Downloads\Ecommerce\ecommerce\frontend\src\pages\admin\POS.jsx"
$lines = [System.IO.File]::ReadAllLines($path)
$part1 = $lines[0..491]
$middle = "    };"
$part2 = $lines[628..($lines.Count - 1)]
$final = $part1 + $middle + $part2
[System.IO.File]::WriteAllLines($path, $final)
Write-Host "Fixed POS.jsx"
