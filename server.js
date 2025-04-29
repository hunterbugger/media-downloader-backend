const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ytdlp = require('yt-dlp-exec');  // yt-dlp package for video download

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle CORS and JSON data
app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle download requests
app.post('/download', async (req, res) => {
  const { url, type, quality } = req.body;

  if (!url || !type) {
    return res.status(400).json({ error: 'Missing URL or type.' });
  }

  try {
    if (type === 'youtube' || type === 'shorts') {
      const formatMap = {
        '360p': 'bestvideo[height<=360]+bestaudio/best[height<=360]',
        '480p': 'bestvideo[height<=480]+bestaudio/best[height<=480]',
        '720p': 'bestvideo[height<=720]+bestaudio/best[height<=720]',
        '1080p': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]',
        'best': 'bestvideo+bestaudio/best'
      };

      const output = await ytdlp(url, {
        format: formatMap[quality] || 'best',
        output: '%(title)s.%(ext)s', // Output file format
      });

      return res.json({ message: '✅ Download started (server-side)!', output });
    } else {
      return res.json({ message: 'Instagram support not implemented yet.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Download failed on server.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
