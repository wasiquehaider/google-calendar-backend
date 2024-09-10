const oAuth2Client = require('../config/google');
const Token = require('../models/token');
const calendarService = require('../services/calendarService');
const { isTokenExpired } = require('../utils/googleAuth');

exports.listEvents = async (req, res) => {
  try {
    let tokens = await Token.findOne({ user: 'default' });
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    if (isTokenExpired(tokens)) {
      const { credentials } = await oAuth2Client.refreshToken(
        tokens.refresh_token
      );
      oAuth2Client.setCredentials(credentials);

      await Token.findOneAndUpdate({ user: 'default' }, credentials, {
        upsert: true,
        new: true,
      });

      tokens = credentials;
    }

    const events = await calendarService.listEvents(oAuth2Client);
    res.json({ events });
  } catch (error) {
    console.error('Error in /eventList', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.currentDayEvents = async (req, res) => {
  try {
    let tokens = await Token.findOne({ user: 'default' });
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    if (isTokenExpired(tokens)) {
      const { credentials } = await oAuth2Client.refreshToken(
        tokens.refresh_token
      );
      oAuth2Client.setCredentials(credentials);

      await Token.findOneAndUpdate({ user: 'default' }, credentials, {
        upsert: true,
        new: true,
      });

      tokens = credentials;
    }

    const events = await calendarService.currentDayEvents(oAuth2Client);
    res.json({ events });
  } catch (error) {
    console.error('Error in /currentDayEvents', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.eventsForDate = async (req, res) => {
  try {
    let tokens = await Token.findOne({ user: 'default' });
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    if (isTokenExpired(tokens)) {
      const { credentials } = await oAuth2Client.refreshToken(
        tokens.refresh_token
      );
      oAuth2Client.setCredentials(credentials);

      await Token.findOneAndUpdate({ user: 'default' }, credentials, {
        upsert: true,
        new: true,
      });

      tokens = credentials;
    }

    // Extract date from query parameters
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    // Fetch events for the date
    const eventsResponse = await calendarService.eventsForDate(
      oAuth2Client,
      targetDate
    );
    const events = eventsResponse.data.items;

    // Current time for comparison
    const currentTime = new Date();

    // Filter for ongoing meetings (meetings that have started but not yet ended)
    const ongoingMeetings = events.filter((event) => {
      const startTime = new Date(event.start.dateTime || event.start.date);
      const endTime = new Date(event.end.dateTime || event.end.date);
      return currentTime >= startTime && currentTime <= endTime;
    });

    // Find the next meeting (meeting that starts after the current time)
    const nextMeeting = events
      .filter((event) => {
        const startTime = new Date(event.start.dateTime || event.start.date);
        return startTime > currentTime;
      })
      .sort(
        (a, b) =>
          new Date(a.start.dateTime || a.start.date) -
          new Date(b.start.dateTime || b.start.date)
      )[0];

    res.json({
      ongoingMeetings,
      nextMeeting,
      allEvents: events,
    });
  } catch (error) {
    console.error('Error in /eventListForDate', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.createEvent = async (req, res) => {
  try {
    let tokens = await Token.findOne({ user: 'default' });
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    if (isTokenExpired(tokens)) {
      const { credentials } = await oAuth2Client.refreshToken(
        tokens.refresh_token
      );
      oAuth2Client.setCredentials(credentials);

      await Token.findOneAndUpdate({ user: 'default' }, credentials, {
        upsert: true,
        new: true,
      });

      tokens = credentials;
    }

    const event = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      attendees: req.body.attendees,
      reminders: req.body.reminders,
    };

    const response = await calendarService.createEvent(oAuth2Client, event);
    res.status(200).send(`Event created: ${response.data.htmlLink}`);
  } catch (error) {
    console.error('Error in /createEvent', error);
    res.status(500).send('Internal Server Error');
  }
};
