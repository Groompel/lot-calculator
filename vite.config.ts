import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Set base path for GitHub Pages
  const base = mode === 'github-pages' ? '/trading-calculator/' : '/';

  return {
    base,
    plugins: [react()],
    css: {
      postcss: './postcss.config.js',
    },
    assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg'],
  };
});
