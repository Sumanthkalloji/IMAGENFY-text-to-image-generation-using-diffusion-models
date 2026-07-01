import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Create image generation task
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const options = {
      method: 'POST',
      headers: {
        'x-freepik-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        resolution: '2k',
        aspect_ratio: 'square_1_1',
        model: 'realism',
        creative_detailing: 33,
        engine: 'automatic',
        filter_nsfw: true
      })
    };

    const response = await fetch('https://api.freepik.com/v1/ai/mystic', options);
    const data = await response.json();

    console.log('Generate image response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image', message: error.message });
  }
});

// Check image generation status
app.get('/api/status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const options = {
      method: 'GET',
      headers: {
        'x-freepik-api-key': apiKey,
        'Accept': 'application/json'
      }
    };

    const response = await fetch(`https://api.freepik.com/v1/ai/mystic/${taskId}`, options);
    const data = await response.json();

    console.log('Status check response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({ error: 'Failed to check status', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`🚀 This server will handle Freepik API calls to avoid CORS issues`);
});
