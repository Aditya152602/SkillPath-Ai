import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'local-api-server',
        configureServer(server) {
          // Mirrors api/chat.js for local dev — Vercel runs the real serverless fn on deploy
          const getBody = (req) =>
            new Promise((resolve, reject) => {
              let body = ''
              req.on('data', (chunk) => (body += chunk.toString()))
              req.on('end', () => resolve(body))
              req.on('error', reject)
            })

          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ error: 'Method not allowed' }))
            }

            const apiKey = env.GROQ_API_KEY
            if (!apiKey || apiKey === 'your_groq_api_key_here') {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              return res.end(
                JSON.stringify({
                  error:
                    'GROQ_API_KEY not set in .env — add your key and restart the dev server, or click "Set API Key" in the app.',
                })
              )
            }

            try {
              const body = await getBody(req)
              const upstream = await fetch(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + apiKey,
                  },
                  body,
                }
              )
              const data = await upstream.json()
              res.statusCode = upstream.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        },
      },
    ],
  }
})
