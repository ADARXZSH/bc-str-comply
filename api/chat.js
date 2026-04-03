module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'No API key' });
  }

  try {
    const { messages, system } = req.body;

    const allMessages = (messages || []);
    const firstUserIdx = allMessages.findIndex(function(m) { return m.role === 'user'; });
    const trimmed = firstUserIdx >= 0 ? allMessages.slice(firstUserIdx) : allMessages;
    const geminiMessages = trimmed.map(function(m) {
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
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
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

    const text = data.candidates
      && data.candidates[0]
      && data.candidates[0].content
      && data.candidates[0].content.parts
      && data.candidates[0].content.parts[0]
      && data.candidates[0].content.parts[0].text
      || 'No response';

    return res.status(200).json({
      content: [{ type: 'text', text: text }]
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};