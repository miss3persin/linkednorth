import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// Reuse Next.js' core web vitals ESLint config (same as `next lint --eslint-config core-web-vitals`).
const nextConfig = require('eslint-config-next/core-web-vitals')

export default nextConfig
