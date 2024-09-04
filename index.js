// const express = require('express');
// const { google } = require('googleapis');

// const app = express();

// const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
// const GOOGLE_PRIVATE_KEY =
//   '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2AdluCUQz9kRz\nNcP4uhD9RVqmnuDv0KQOWmxNxLHBF0HCPAC9vjPX+sMnZtumX1jQj5qcq6m/qlJU\nrI+TLxzDWhY7s3J54wxNGVXj9GYyJOwRTim2g2cQgcw+d/L5o50BWGkuS/yYeOFO\nBWFYIlFhhkoUajLfdQcTHA5h/9m3nrjQ66KKwPVnHTggH3l623TfQvg1GGb0VfJF\nInYfSnd5th0cai5jk7DLQOFDAbRX/Ghg0fqTPSlY68HZgkX87kQLjvWXPWJObfjv\nT1zAeSEQ6oLsPuJBaQBMqxtGOSfFzNtMxd6ZQH97GqCTIitpDlj/ynEIjs2Qjjk3\n7yzoOILbAgMBAAECggEAUZqyqittcP7R4fYRT8vdIjGeW2aQ4/VgGS9hr9yo9jI/\nQZ81ld1Z0VSVe20avpWxdJFueSBek5kCIQTdutg8xTn3Df1/LjcmpMrfP72stH7p\neTjaawKviy8nLDsLrfI1ywyg3CklsBdCrYCsDKAWbOuQ+2ZCOP53lZHWwQm9zB2U\nWtd9bMEbr5px2QgL+kamsM22MHycF/VTrmwxc+H7j7viSgdh8VUwge0EwPbCfCE2\nVD8TvoP6t2/Fd5Ym7FR4SDS1oNGdlKuP45EF/aIiY/Cyu3Q0/JPMnqihdkYaFp1G\nYJFhggUMderOlScoNRlBkBYPKxWWwy/A38ZCbq20QQKBgQDjgv1eKL0qdUDEsfKK\n12n3eS6MfYUBQ/mGR91+jHhp712TP+jld9lpvTEvFm9akUIIi/9nvc/nGBTrbByv\nHY6Ljyl620WTAWzvSCLdWxroJhlVu4/v8qeYtlAtc8EJCJA6KEgH8mYtx+Rs+3tT\nJdA3yyVQVzgWUBT1Ai1qmpwrRwKBgQDMzDCMInaUyIvv8zZMOOwUcEl4NWz0Lly9\nFbwDEq+ghKKt6c1/5/i186ra01Pw7PW8RdNFR/FTTKqJard/SwcGXgjM3Brzjv92\n8l6qnsxGYr12r2c5QM8f6qTOvxjXDH0gSkUWHejCg9LXzP2Ai7c02UZGh1bW0XVC\nH4fj/m7NzQKBgB557ozNckGcwVdX6wCUSJqg/g5NxiJcQ7GsMMyB7qNqMCPIfN84\nRcR3Vn5TSAleyfSxJD52W8I+JJdAvTrr/6tMOyc89j3yA/CtvhXe3WTZra0hWe+v\nlqnLSkQ8bFBUeFWCDdwaqXtaeovqyCNkPlcq/E2d0WKTyarkZscP/PmDAoGAMrRz\naJ63wUqN6xDKZsDJIp5ScmK34RUBfQc+j3w244UzSd/TM1HZsCLuMFOWOtZQWRbo\nogSX6UnYB0HWwLtwt9DcWOw9+AN1mJuVeKTsapjT0+jFo9U58usDdvS1T7kV2cLJ\nrBonoNFGiIuGUCdHatxIm/myNGmToJVx7a72/BkCgYBsl3G584a/xoeoGcw7yFJ9\nG8k0fEy9HmWuSj2cqSLJyzu1i6rEehb8SAGGV1qo8LDoDSylePOEPiDNBOYMMUZZ\nsVXYnBuHVSzRcvIxo5CDJk1jwl+E5DYtNYyaEWPd3t8sFn1aRV2sxvqYArqFqRpZ\n/hO0wR/sbOfSt+xw6ozC5g==\n-----END PRIVATE KEY-----\n';
// const GOOGLE_CLIENT_EMAIL =
//   'google-calendar-key@ace-matrix-434507-k3.iam.gserviceaccount.com';
// const GOOGLE_PROJECT_NUMBER = '935788592411';
// const GOOGLE_CALENDAR_ID =
//   '5f737bbe7c86c3f069b8eb377fa5a5fbf1bd6071f16836408fdfe948138188d4@group.calendar.google.com';

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
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;

  oAuth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.error('Error retrieving access token', err);
      return;
    }
    oAuth2Client.setCredentials(tokens);

    // Store the tokens for later use (e.g., in a database)
    // Create an event using the tokens
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      summary: 'My Event',
      location: 'Karachi, Pakistan',
      description: 'Creating an event using OAuth 2.0',
      start: {
        dateTime: '2024-09-06T12:00:00+05:00',
        timeZone: 'Asia/Karachi',
      },
      end: {
        dateTime: '2024-09-06T5:00:00+05:00',
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

    calendar.events.insert(
      {
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all',
      },
      (err, event) => {
        if (err) {
          console.error('Error creating event', err);
          return;
        }
        console.log('Event created: %s', event.htmlLink);
        res.send('Event created');
      }
    );
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
