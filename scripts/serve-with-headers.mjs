// Petit serveur statique pour la CI (scan ZAP) qui applique les MÊMES
// en-têtes de sécurité que la prod OVH, en les lisant directement dans
// dist/.htaccess (copié depuis public/.htaccess au build) — une seule
// source de vérité, versionnée, qui part aussi dans le déploiement FTP.
//
// Usage : node scripts/serve-with-headers.mjs [dist] [port]

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', process.argv[2] || 'dist')
const port = Number(process.argv[3] || 8080)
const htaccessPath = path.join(distDir, '.htaccess')

function parseHeadersFromHtaccess(filePath) {
  const headers = {}
  let raw
  try {
    raw = readFileSync(filePath, 'utf8')
  } catch {
    console.warn(`Pas de .htaccess trouvé à ${filePath}, aucun en-tête appliqué.`)
    return headers
  }
  const re = /Header always set ([\w-]+) "([^"]+)"/g
  let match
  while ((match = re.exec(raw))) {
    headers[match[1]] = match[2]
  }
  return headers
}

const securityHeaders = parseHeadersFromHtaccess(htaccessPath)
console.log('En-têtes de sécurité repris de dist/.htaccess :', securityHeaders)

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

const server = createServer(async (req, res) => {
  for (const [name, value] of Object.entries(securityHeaders)) {
    res.setHeader(name, value)
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0])
  let filePath = path.join(distDir, urlPath)

  try {
    const s = await stat(filePath)
    if (s.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
  } catch {
    // Pas de fichier ni de dossier : fallback SPA, comme le
    // "RewriteRule . /index.html" du .htaccess.
    filePath = path.join(distDir, 'index.html')
  }

  try {
    const content = await readFile(filePath)
    const ext = path.extname(filePath)
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
    res.writeHead(200)
    res.end(content)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(port, () => {
  console.log(`Serveur de test (avec en-têtes de sécu) sur http://localhost:${port}`)
})
