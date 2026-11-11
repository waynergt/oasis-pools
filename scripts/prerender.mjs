// Build step: inserts the server-rendered page into dist/index.html (see src/entry-server.tsx).
// Runs after `vite build` (client) and `vite build --ssr` (server bundle in dist-ssr/).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const ssrDir = path.join(root, 'dist-ssr')
const htmlFile = path.join(root, 'dist', 'index.html')
const marker = '<div id="root"></div>'

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const html = fs.readFileSync(htmlFile, 'utf8')
if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`)

const appHtml = render()
fs.writeFileSync(htmlFile, html.replace(marker, () => `<div id="root">${appHtml}</div>`))
fs.rmSync(ssrDir, { recursive: true, force: true })

console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`)
