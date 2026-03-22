export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'No API key' });
  }

  try {
    const { messages, system } = req.body;

    const geminiMessages = (messages || []).map(function(m) {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      };
    });

    const body = {
      contents: geminiMessages,
      generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
    };

    if (system) {
      body.system_instruction = { parts: [{ text: system }] };
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return res.status(200).json({
      content: [{ type: 'text', text: text }]
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


