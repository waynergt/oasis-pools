import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Public URL of the site. Set VITE_SITE_URL in Vercel (and .env) when the custom domain is live,
 * e.g. VITE_SITE_URL=https://oasispoolsco.com — canonical URL, share image, sitemap and robots.txt
 * all update automatically on the next deploy.
 */
const DEFAULT_SITE_URL = 'https://oasis-pools-six.vercel.app'

/** Writes __SITE_URL__ into index.html and generates sitemap.xml + robots.txt at build time. */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'oasis-seo-files',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), seoFiles(siteUrl)],
    define: { __SITE_URL__: JSON.stringify(siteUrl) },
  }
})
