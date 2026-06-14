import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getBradAiAnswer } from './lib/bradAi';
import { scanColorCode } from './lib/colorScan';

const readJsonBody = async (req: NodeJS.ReadableStream) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf-8').trim();
  return raw ? JSON.parse(raw) : {};
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      tailwindcss(),
      react(),
      {
        name: 'brad-ai-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/brad-ai', async (req, res, next) => {
            if (req.method !== 'POST') {
              next();
              return;
            }

            try {
              const body = await readJsonBody(req);
              const messages = Array.isArray(body?.messages) ? body.messages : [];

              if (messages.length === 0) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Payload messages wajib diisi.' }));
                return;
              }

              const answer = await getBradAiAnswer(messages);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ answer }));
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Brad Ai gagal memproses permintaan.';
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });

          server.middlewares.use('/api/scan-color', async (req, res, next) => {
            if (req.method !== 'POST') {
              next();
              return;
            }

            try {
              const body = await readJsonBody(req);
              const image = typeof body?.image === 'string' ? body.image : '';

              if (!image) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Payload image wajib diisi.' }));
                return;
              }

              const code = await scanColorCode(image);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ code }));
            } catch (error) {
              const message = error instanceof Error ? error.message : 'OCR kode warna gagal diproses.';
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });
        },
      },
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'supabase-vendor': ['@supabase/supabase-js'],
            'canvas-vendor': ['html2canvas'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
