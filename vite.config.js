  import { defineConfig, loadEnv } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            target: env.VITE_API_BASE_URL || 'http://localhost:9001',
            changeOrigin: true,
            secure: false,
          }
        },
        // Disable file system caching to prevent stale module issues
        fs: {
          cachedChecks: false
        }
      },
      optimizeDeps: {
        // CRITICAL FIX: Disable dependency optimization to prevent cache corruption
        // This eliminates the .vite/deps cache that was causing intermittent errors
        disabled: true
      },
      build: {
        target: 'esnext'
      }
    }
  })