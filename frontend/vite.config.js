import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss({
      optimize: true,  // Enables Tailwind's built-in optimizations
      nesting: true,   // Enables CSS nesting support
    })
  ],
  build: {
    cssCodeSplit: true,      // CSS optimization
    },
}));