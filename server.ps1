$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "Listening on port $port (127.0.0.1 and localhost)..."
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $url = $request.Url.LocalPath
            if ($url -eq "/") { $url = "/index.html" }
            
            # Use native robust URI unescape instead of System.Web.HttpUtility
            $decodedUrl = [System.Uri]::UnescapeDataString($url)
            
            $filePath = Join-Path "e:\project\portfolio design" $decodedUrl.Substring(1)
            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                
                # Determine content type
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = "application/octet-stream"
                if ($ext -eq ".html") { $contentType = "text/html; charset=utf-8" }
                elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
                elseif ($ext -eq ".js") { $contentType = "application/javascript; charset=utf-8" }
                elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
                elseif ($ext -eq ".png") { $contentType = "image/png" }
                elseif ($ext -eq ".gif") { $contentType = "image/gif" }
                elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" }
                
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $filePath")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.Close()
        } catch {
            Write-Host "Request handling error: $_"
            if ($null -ne $response) {
                try { $response.Close() } catch {}
            }
        }
    }
} catch {
    Write-Host "Fatal server error: $_"
    if ($listener.IsListening) { $listener.Stop() }
}
