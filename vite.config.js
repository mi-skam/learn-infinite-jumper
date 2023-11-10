import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  base:
    process.env.DEPLOY_ENV === 'gh-pages' ? '/learn-infinite-jumper/' : '/',
  plugins: [
    eslintPlugin({
      cache: false,
      failOnError: false,
    }),
  ],
  assetsInclude: ['**/*.mp3', '**/*.jpeg', '**/*.png', '**/*.task'],
});
