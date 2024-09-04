// const express = require('express');
// const { google } = require('googleapis');
// const dotenv = require('dotenv');
// const { OAuth2 } = google.auth;

// const oAuth2Client = new OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

// dotenv.config();

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Home route');
// });

// app.get('/test', (req, res) => {
//   res.send('Testing route');
// });

// // Redirect to Google's OAuth 2.0 server for consent
// app.get('/auth', (req, res) => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: 'https://www.googleapis.com/auth/calendar',
//   });
//   res.redirect(authUrl);
// });

// // Handle the callback and exchange code for tokens
// app.get('/oauth2callback', async (req, res) => {
//   try {
//     if (req.method === 'GET') {
//       const code = req.query.code;

//       if (!code) {
//         return res.status(400).send('No code provided');
//       }

//       const { tokens } = await oAuth2Client.getToken(code);
//       oAuth2Client.setCredentials(tokens);

//       // Continue with your event creation logic
//       const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

//       const event = {
//         summary: 'Defence Day Celebration',
//         location: 'Karachi, Pakistan',
//         description: 'Creating an event using OAuth 2.0',
//         start: {
//           dateTime: '2024-09-06T09:00:00+05:00',
//           timeZone: 'Asia/Karachi',
//         },
//         end: {
//           dateTime: '2024-09-06T10:00:00+05:00',
//           timeZone: 'Asia/Karachi',
//         },
//         attendees: [
//           { email: 'wasiquehaider02@gmail.com' },
//           { email: 'wasiquedd@gmail.com' },
//         ],
//         reminders: {
//           useDefault: false,
//           overrides: [
//             { method: 'email', minutes: 24 * 60 },
//             { method: 'popup', minutes: 10 },
//           ],
//         },
//       };

//       const response = await calendar.events.insert({
//         calendarId: 'primary',
//         resource: event,
//         sendUpdates: 'all',
//       });

//       res.status(200).send(`Event created: ${response.data.htmlLink}`);
//     } else {
//       res.status(405).send('Method Not Allowed');
//     }
//   } catch (error) {
//     console.error('Error in /oauth2callback', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

const express = require('express');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // To load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN_PATH = path.join(__dirname, 'tokens.json');

// Initialize OAuth2 client
const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Route to authenticate and redirect to Google's OAuth 2.0 server
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar.readonly', // Scopes for read-only access
  });
  res.redirect(authUrl);
});

// OAuth2 callback to handle token exchange
app.get('/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send('No code provided');
    }

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens to file
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    res.redirect('/eventList'); // Redirect to /eventList to show events or another page
  } catch (error) {
    console.error('Error in /oauth2callback', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to load tokens from file
function loadTokens() {
  try {
    const data = fs.readFileSync(TOKEN_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Function to check if token is expired
function isTokenExpired(token) {
  const now = Date.now();
  return token.expiry_date < now;
}

// Endpoint to list events
app.get('/eventList', async (req, res) => {
  try {
    let tokens = loadTokens();
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    const oAuth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials(tokens);

    // Check if token is expired and refresh if needed
    if (isTokenExpired(tokens)) {
      const { credentials } = await oAuth2Client.refreshToken(
        tokens.refresh_token
      );
      oAuth2Client.setCredentials(credentials);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
      tokens = credentials; // Update tokens with refreshed credentials
    }

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // Fetch events from the primary calendar
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
