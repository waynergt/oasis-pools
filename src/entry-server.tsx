import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'

/**
 * Server render used only at build time (scripts/prerender.mjs).
 * The resulting HTML is written into dist/index.html so search engines, AI assistants
 * and link previews get the full page content without running JavaScript.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
