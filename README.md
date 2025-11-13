# Kora Audio Backend

Secure serverless backend for Kora language learning app. Proxies OpenAI API calls to keep API keys secure.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

**Important:** Get a new API key from https://platform.openai.com/api-keys and rotate your old one since it was exposed in the client.

### 3. Local Development

```bash
npm run dev
```

This starts a local Vercel dev server at `http://localhost:3000`

### 4. Deploy to Vercel

#### First Time Setup:

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `OPENAI_API_KEY` with your OpenAI API key
   - Redeploy

#### Subsequent Deployments:

```bash
npm run deploy
```

## API Endpoints

### POST /api/tts

Text-to-Speech endpoint

**Request:**
```json
{
  "text": "Hello world",
  "voice": "alloy",
  "speed": 1.0
}
```

**Response:**
```json
{
  "audio": "base64-encoded-mp3-audio",
  "format": "mp3"
}
```

### POST /api/stt

Speech-to-Text endpoint

**Request:**
```json
{
  "audioBase64": "base64-encoded-audio-file",
  "language": "en"
}
```

**Response:**
```json
{
  "transcription": "transcribed text"
}
```

## Security

- API keys are stored securely in Vercel environment variables
- Never exposed to client-side code
- CORS enabled for your app's domain
- No API keys bundled in the mobile app

## Cost Monitoring

Monitor your OpenAI usage at: https://platform.openai.com/usage

Consider adding rate limiting in the future to prevent abuse.