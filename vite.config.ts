import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), vueJsx({})],
  // 配置srv别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
