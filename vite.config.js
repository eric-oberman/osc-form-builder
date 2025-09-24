import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'OSC Electronic Form Builder',
                short_name: 'OSC Forms',
                description: 'New York State Office of State Comptroller Electronic Form Builder',
                theme_color: '#0f172a',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            }
                        }
                    }
                ]
            },
            devOptions: {
                enabled: false
            },
            disable: process.env.NODE_ENV === 'development'
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/pages': path.resolve(__dirname, './src/pages'),
            '@/stores': path.resolve(__dirname, './src/stores'),
            '@/types': path.resolve(__dirname, './src/types'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/services': path.resolve(__dirname, './src/services'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/contexts': path.resolve(__dirname, './src/contexts'),
            '@/data': path.resolve(__dirname, './src/data'),
            '@/assets': path.resolve(__dirname, './src/assets')
        }
    },
    server: {
        port: 3000,
        open: true,
        host: true
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['@headlessui/react', '@heroicons/react', 'lucide-react'],
                    charts: ['recharts', 'chart.js', 'react-chartjs-2'],
                    forms: ['react-hook-form', '@dnd-kit/core', '@dnd-kit/sortable'],
                    utils: ['date-fns', 'clsx', 'tailwind-merge']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            '@headlessui/react',
            '@heroicons/react/24/outline',
            '@heroicons/react/24/solid',
            'lucide-react',
            'zustand',
            '@tanstack/react-query',
            'react-hook-form',
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/utilities'
        ]
    }
});
