// api/stt.js - Speech-to-Text endpoint
const axios = require('axios');
const FormData = require('form-data');

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
    const { audioBase64, language = 'en' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    console.log('[STT API] Transcribing audio:', { language, audioLength: audioBase64.length });

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    // Create FormData for OpenAI Whisper API
    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename: 'audio.m4a',
      contentType: 'audio/m4a',
    });
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    formData.append('response_format', 'text');

    // Call OpenAI Whisper API
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log('[STT API] Transcription successful:', response.data.substring(0, 100));

    res.status(200).json({
      transcription: response.data,
    });
  } catch (error) {
    console.error('[STT API] Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to transcribe audio',
      message: error.message,
    });
  }
};