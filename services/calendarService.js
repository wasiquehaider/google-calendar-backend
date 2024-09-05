const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3' });

exports.listEvents = async (auth) => {
  return await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
    auth,
  });
};

exports.createEvent = async (auth, event) => {
  return await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    sendUpdates: 'all',
    auth,
  });
};
