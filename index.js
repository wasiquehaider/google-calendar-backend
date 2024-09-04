// const express = require('express');
// const { google } = require('googleapis');
// const dotenv = require('dotenv');

// dotenv.config();
// const app = express();

// const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
// const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

// const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;

// const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER;
// const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// const jwtClient = new google.auth.JWT(
//   GOOGLE_CLIENT_EMAIL,
//   null,
//   GOOGLE_PRIVATE_KEY,
//   SCOPES
// );

// const calendar = google.calendar({
//   version: 'v3',
//   project: GOOGLE_PROJECT_NUMBER,
//   auth: jwtClient,
// });

// app.get('/', (req, res) => {
//   calendar.events.list(
//     {
//       calendarId: GOOGLE_CALENDAR_ID,
//       timeMin: new Date().toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     },
//     (error, result) => {
//       if (error) {
//         res.send(JSON.stringify({ error: error }));
//       } else {
//         if (result.data.items.length) {
//           res.send(JSON.stringify({ events: result.data.items }));
//         } else {
//           res.send(JSON.stringify({ message: 'No upcoming events found.' }));
//         }
//       }
//     }
//   );
// });

// app.get('/createEvent', (req, res) => {
//   var event = {
//     summary: 'Defense Day Celebration!',
//     location: 'Karachi, Pakistan',
//     description: 'Defense day with nodeJS!',
//     start: {
//       dateTime: '2024-09-06T09:00:00+05:00',
//       timeZone: 'Asia/Karachi',
//     },
//     end: {
//       dateTime: '2024-09-06T10:00:00+05:00',
//       timeZone: 'Asia/Karachi',
//     },
//     attendees: [
//       //   { email: 'wasiquehaider02@gmail.com' },
//       //   { email: 'wasiquedd@gmail.com' },
//     ],
//     reminders: {
//       useDefault: false,
//       overrides: [
//         { method: 'email', minutes: 24 * 60 },
//         { method: 'popup', minutes: 10 },
//       ],
//     },
//   };

//   const auth = new google.auth.GoogleAuth({
//     keyFile: './service_account.json',
//     scopes: 'https://www.googleapis.com/auth/calendar',
//   });
//   auth.getClient().then((a) => {
//     calendar.events.insert(
//       {
//         auth: a,
//         calendarId: GOOGLE_CALENDAR_ID,
//         resource: event,
//         // sendUpdates: 'all',
//       },
//       function (err, event) {
//         if (err) {
//           console.log(
//             'There was an error contacting the Calendar service: ' + err
//           );
//           return;
//         }
//         console.log('Event created: %s', event.data);
//         res.jsonp('Event successfully created!');
//       }
//     );
//   });
// });

// app.listen(3000, () => console.log(`App listening on port 3000!`));

const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Home route');
});

app.get('/test', (req, res) => {
  res.send('Testing route');
});

// Redirect to Google's OAuth 2.0 server for consent
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar',
  });
  res.redirect(authUrl);
});

// Handle the callback and exchange code for tokens
// app.get('/oauth2callback', (req, res) => {
//   const code = req.query.code;

//   oAuth2Client.getToken(code, (err, tokens) => {
//     if (err) {
//       console.error('Error retrieving access token', err);
//       return;
//     }
//     oAuth2Client.setCredentials(tokens);

//     // Store the tokens for later use (e.g., in a database)
//     // Create an event using the tokens
//     const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

//     const event = {
//       summary: 'My Event',
//       location: 'Karachi, Pakistan',
//       description: 'Creating an event using OAuth 2.0',
//       start: {
//         dateTime: '2024-09-06T12:00:00+05:00',
//         timeZone: 'Asia/Karachi',
//       },
//       end: {
//         dateTime: '2024-09-06T5:00:00+05:00',
//         timeZone: 'Asia/Karachi',
//       },
//       attendees: [
//         // { email: 'wasiquehaider02@gmail.com' },
//         // { email: 'wasiquedd@gmail.com' },
//       ],
//       reminders: {
//         useDefault: false,
//         overrides: [
//           { method: 'email', minutes: 24 * 60 },
//           { method: 'popup', minutes: 10 },
//         ],
//       },
//     };

//     calendar.events.insert(
//       {
//         calendarId: 'primary',
//         resource: event,
//         // sendUpdates: 'all',
//       },
//       (err, event) => {
//         if (err) {
//           console.error('Error creating event', err);
//           return;
//         }
//         console.log('Event created: %s', event.htmlLink);
//         res.send('Event created');
//       }
//     );
//   });
// });

app.get('/oauth2callback', async (req, res) => {
  try {
    if (req.method === 'GET') {
      const code = req.query.code;

      if (!code) {
        return res.status(400).send('No code provided');
      }

      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Continue with your event creation logic
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      const event = {
        summary: 'Defence Day Celebration',
        location: 'Karachi, Pakistan',
        description: 'Creating an event using OAuth 2.0',
        start: {
          dateTime: '2024-09-06T09:00:00+05:00',
          timeZone: 'Asia/Karachi',
        },
        end: {
          dateTime: '2024-09-06T10:00:00+05:00',
          timeZone: 'Asia/Karachi',
        },
        attendees: [
          { email: 'wasiquehaider02@gmail.com' },
          { email: 'wasiquedd@gmail.com' },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all',
      });

      res.status(200).send(`Event created: ${response.data.htmlLink}`);
    } else {
      res.status(405).send('Method Not Allowed');
    }
  } catch (error) {
    console.error('Error in /oauth2callback', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
