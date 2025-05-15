import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Prevent direct usage of the development server
// This is a simple approach that works in the vite.config context
const args = process.argv || [];
const inDevMode = 
  (process.env.NODE_ENV !== 'production' && 
   (args.includes('--mode=development') || 
    args.includes('dev') || 
    args.includes('serve')));

if (inDevMode) {
  // Use a more TypeScript-friendly approach for console methods
  const messages = [
    '\x1b[31m❌ DEVELOPMENT SERVER DISABLED\x1b[0m',
    '\x1b[33m-------------------------------------------\x1b[0m',
    'The development server has been intentionally disabled.',
    '',
    '\x1b[36mHomni uses a production-only workflow:\x1b[0m',
    '1. Make changes in the source directory',
    '2. Run "./deploy.sh" from the project root',
    '3. View your changes at http://localhost:8080',
    '',
    '\x1b[33mUsing separate development/production environments\x1b[0m',
    '\x1b[33mcreated synchronization issues, caching problems,\x1b[0m',
    '\x1b[33mand inconsistent behavior.\x1b[0m',
    '',
    '\x1b[32mPlease run: cd /Users/jforwood/Desktop/Homni && ./deploy.sh\x1b[0m',
    '\x1b[33m-------------------------------------------\x1b[0m'
  ];
  
  // Print each message
  messages.forEach(msg => console.error(msg));
  
  // Exit with error code
  process.exit(1);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    // Ensure clean build output
    emptyOutDir: true
  },
  publicDir: 'public' // This is the default, but being explicit
})
