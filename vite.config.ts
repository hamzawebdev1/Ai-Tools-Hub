import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: 'hidden',
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('src/pages/AdminDashboardPage') || id.includes('src/components/admin')) {
              return 'admin-bundle';
            }
            if (id.includes('src/pages/DashboardPage') || id.includes('src/components/security')) {
              return 'dashboard-bundle';
            }
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              if (id.includes('firebase')) {
                return 'firebase';
              }
              if (id.includes('pdf-lib') || id.includes('pdfjs-dist') || id.includes('@pdfsmaller')) {
                return 'pdf-engine';
              }
              if (id.includes('tesseract.js')) {
                return 'ocr-engine';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
