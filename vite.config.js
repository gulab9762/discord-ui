import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { setupSyncServer } from './server/syncServer.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'lounge-multiplayer-sync',
      configureServer(server) {
        setupSyncServer(server.httpServer);
      },
      configurePreviewServer(server) {
        setupSyncServer(server.httpServer);
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true, // Allows Discord proxy (*.discordsays.com) and Cloudflare tunnels
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
})
