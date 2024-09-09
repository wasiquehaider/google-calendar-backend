const express = require('express');
const { google } = require('googleapis');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Initialize OAuth2 client
const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// MongoDB connection using Mongoose
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define the token schema and model
const tokenSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: Number,
});

const Token = mongoose.model('Token', tokenSchema, 'tokens');

// Google OAuth2 Authorization Route
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar',
  });
  res.redirect(authUrl);
});

// Google OAuth2 Callback Route
app.get('/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send('No code provided');
    }

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens to MongoDB
    await Token.findOneAndUpdate(
      { user: 'default' }, // Replace with a user identifier if needed
      tokens,
      { upsert: true, new: true }
    );

    res.redirect('/eventList');
  } catch (error) {
    console.error('Error in /oauth2callback', error);
    res.status(500).send('Internal Server Error');
  }
});

// Load tokens from MongoDB
async function loadTokens() {
  return await Token.findOne({ user: 'default' });
}

// Check token expiration
function isTokenExpired(token) {
  const now = Date.now();
  return token.expiry_date < now;
}

// Event List Endpoint
app.get('/eventList', async (req, res) => {
  try {
    let tokens = await loadTokens();
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    if (isTokenExpired(tokens)) {
      const { credentials } = await oAuth2Client.refreshToken(
        tokens.refresh_token
      );
      oAuth2Client.setCredentials(credentials);

      // Update tokens in MongoDB
      await Token.findOneAndUpdate({ user: 'default' }, credentials, {
        upsert: true,
        new: true,
      });

      tokens = credentials;
    }

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    if (response.data.items.length) {
      res.json({ events: response.data.items });
    } else {
      res.status(200).send('No upcoming events found.');
    }
  } catch (error) {
    console.error('Error in /eventList', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/createEvent', async (req, res) => {
  try {
    let tokens = await loadTokens();
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    if (isTokenExpired(tokens)) {
      const { credentials } = await oAuth2Client.refreshToken(
        tokens.refresh_token
      );
      oAuth2Client.setCredentials(credentials);

      // Update tokens in MongoDB
      await Token.findOneAndUpdate({ user: 'default' }, credentials, {
        upsert: true,
        new: true,
      });

      tokens = credentials;
    }

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      attendees: req.body.attendees,
      reminders: req.body.reminders,
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all',
    });

    res.status(200).send(`Event created: ${response.data.htmlLink}`);
  } catch (error) {
    console.error('Error in /oauth2callback', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
