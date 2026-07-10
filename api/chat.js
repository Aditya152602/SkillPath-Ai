export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({
      error:
        'GROQ_API_KEY is not configured. Go to Vercel → Project Settings → Environment Variables, add GROQ_API_KEY, then redeploy.',
    })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()

    // Forward Groq's status (429 rate-limit, 401 bad key, etc.)
    return res.status(response.status).json(data)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
