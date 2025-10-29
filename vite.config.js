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
        // CRITICAL FIX: Exclude only packages causing cache corruption
        // Keep optimization enabled for CJS modules (like hoist-non-react-statics)
        exclude: ['@mui/icons-material'],

        // Force rebuild on every server start to prevent stale cache
        force: true
      },
      build: {
        target: 'esnext'
      }
    }
  })