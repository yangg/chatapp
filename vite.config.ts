import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const isBuildLib = !!process.env.BUILD_LIB
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {}
  },
  build: {
    ...(isBuildLib ? {
      lib: {
        entry: 'src/main.tsx',
        name: 'ChatApp',
        formats: ['umd'],
        fileName: () => `chatapp.umd.js`
      },
    } : {}),
    // rollupOptions: {
    //   external: ['react', 'react-dom'],
    //   output: {
    //     assetFileNames: '[name].[ext]',
    //     globals: {
    //       react: 'React',
    //       'react-dom': 'ReactDOM',
    //     },
    //   },
    // },
  },
})