# Run from project root if /api/auth/session returns 404
$dir = 'src\app\api\auth\[...nextauth]'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$content = @'
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
'@
Set-Content -Path (Join-Path $dir 'route.ts') -Value $content -Encoding UTF8
Write-Host "Created $dir\route.ts — restart npm run dev"
Write-Host "Test: http://localhost:3000/api/auth/session (should return JSON, not HTML)"
