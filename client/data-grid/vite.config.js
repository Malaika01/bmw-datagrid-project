import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // THIS FORCES VITE TO USE THE SAME REACT FOR EVERYTHING
      react: path.resolve('./node_modules/react'),
    },
  },
})