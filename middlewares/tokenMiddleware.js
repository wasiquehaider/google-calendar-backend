const oAuth2Client = require('../config/google');
const Token = require('../models/token');
const { isTokenExpired } = require('../utils/googleAuth');

const verifyToken = async (req, res, next) => {
  try {
    // Load tokens from MongoDB
    const tokens = await Token.findOne({ user: 'default' }); // Adjust as needed for user identification

    if (!tokens) {
      return res.status(401).send('Not authenticated');
    }

    oAuth2Client.setCredentials(tokens);

    // Check if token is expired
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
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in tokenMiddleware:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  verifyToken,
};
