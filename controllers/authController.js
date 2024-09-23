const oAuth2Client = require('../config/google');
const Token = require('../models/token');

exports.getAuthUrl = (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
  res.redirect(authUrl);
};

exports.oauth2callback = async (req, res) => {
  try {
    const code = req.query.code || req.query.access_token;
    console.log('code is ', code);
    if (!code) {
      return res.status(400).send('No code provided');
    }

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    await Token.findOneAndUpdate({ user: 'default' }, tokens, {
      upsert: true,
      new: true,
    });

    // res.redirect('/currentDayEvents');
    // res.send('Logged in successfully');
    res.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expiry_date,
      token_type: tokens.token_type,
    });
  } catch (error) {
    console.error('Error in /oauth2callback', error);
    res.status(500).send('Internal Server Error');
  }
};
