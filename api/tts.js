// api/tts.js - Text-to-Speech endpoint
const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS for your app
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'alloy', speed = 1.0 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('[TTS API] Generating speech:', { text: text.substring(0, 50), voice, speed });

    // Call OpenAI TTS API
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        voice: voice,
        input: text,
        speed: speed,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    console.log('[TTS API] Speech generated successfully');

    // Return audio as base64
    const base64Audio = Buffer.from(response.data).toString('base64');

    res.status(200).json({
      audio: base64Audio,
      format: 'mp3',
    });
  } catch (error) {
    console.error('[TTS API] Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to generate speech',
      message: error.message,
    });
  }
};