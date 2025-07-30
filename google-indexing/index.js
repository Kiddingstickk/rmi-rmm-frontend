require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(process.env.KEY_PATH),
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing({
  version: 'v3',
  auth,
});

/**
 * Notify Google Indexing API about a new or updated manager profile
 * @param {string} managerId - MongoDB ObjectId of the manager
 */
async function notifyGoogleManager(managerId) {
  const url = `https://ratemymanagement.com/management/managers/${managerId}`;

  try {
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: 'URL_UPDATED',
      },
    });
    console.log(`✅ Indexed: ${url}`, res.data);
  } catch (err) {
    console.error(`❌ Failed to index: ${url}`, err.response?.data || err.message);
  }
}

module.exports = { notifyGoogleManager };