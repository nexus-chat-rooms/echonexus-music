const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = 'c85bde84148f41c1863b4dd92a83f678'; // Your client ID
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Your client secret
const REDIRECT_URI = `nexus-chat-rooms.github.io/nexusmusicplayer`; // Redirect URI

app.use(cors());
app.use(express.static('public'));

// Routes for login and callback
app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email';
    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: nexus-chat-rooms.github.io/nexusmusicplayer,
            client_id: c85bde84148f41c1863b4dd92a83f678,
            client_secret: 9e22e31088e04900892b09e2ee81e22c,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        res.send(`
            <h1>Welcome to Nexus Echo Music Player</h1>
            <script>
                localStorage.setItem('accessToken', '${accessToken}');
                window.location.href = '/';
            </script>
        `);
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send('Error getting tokens');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
