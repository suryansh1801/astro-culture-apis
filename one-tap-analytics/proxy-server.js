// proxy-server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Use the CORS middleware
app.use(cors());

// The API key from our environment variables
const API_KEY = process.env.REACT_APP_ONETAP_API_KEY;

const BASE_URL = process.env.REACT_APP_ONETAP_BASE_URL;

// A single route to handle all our API requests
app.get('/api/:endpoint', async (req, res) => {
    const { endpoint } = req.params;
    const targetUrl = `${BASE_URL}/${endpoint}`;

    console.log(`[Proxy Server] Forwarding request to: ${targetUrl}`);

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'X-API-Key': API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('[Proxy Server] Error fetching data:', error.response ? error.response.data : error.message);
        // Forward the error status and message back to the React app
        res.status(error.response ? error.response.status : 500).json({
            message: 'Error fetching data from target API',
            error: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`[Proxy Server] Running on http://localhost:${PORT}`);
    if (!API_KEY) {
        console.warn('[Proxy Server] Warning: REACT_APP_ONETAP_API_KEY is not defined.');
    }
});