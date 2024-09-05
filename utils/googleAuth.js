const oAuth2Client = require('../config/google');

exports.isTokenExpired = (token) => {
  const now = Date.now();
  return token.expiry_date < now;
};
