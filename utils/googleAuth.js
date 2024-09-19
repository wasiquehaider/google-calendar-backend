const { google } = require('googleapis');
const oAuth2Client = require('../config/google');

exports.isTokenExpired = (token) => {
  const now = Date.now();
  return token.expiry_date < now;
};

exports.getUserEmail = async (auth) => {
  const peopleService = google.people({ version: 'v1', auth });
  const me = await peopleService.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses',
  });
  const emails = me.data.emailAddresses;
  return emails && emails.length > 0 ? emails[0].value : null;
};
