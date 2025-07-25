import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
    plugins: [
        react(),
        tailwindcss({
            optimize: true,
            nesting: true,
        }),
        svgr()
    ],
    build: {
        cssCodeSplit: true,
        outDir: 'dist',
        sourcemap: false,
    }
}));