const oAuth2Client = require('../config/google');
const Token = require('../models/token');
const calendarService = require('../services/calendarService');

exports.listEvents = async (req, res) => {
  try {
    let tokens = await Token.findOne({ user: 'default' });
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    if (calendarService.isTokenExpired(tokens)) {
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

exports.createEvent = async (req, res) => {
  try {
    let tokens = await Token.findOne({ user: 'default' });
    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    if (calendarService.isTokenExpired(tokens)) {
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
