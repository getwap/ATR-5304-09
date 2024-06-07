/* --------- SECURED cloud database connection ---------- */

const mongoose = require('mongoose');
require('dotenv').config({ path: './config-secured.env' });

const crypyDB = mongoose.createConnection(process.env.DATABASE_SECURED_CRYPY);
crypyDB.on('connected', () => {
  console.log('Password > Live cloud database connected.');
});

crypyDB.model('vaultLogin', require('./models/crypy-piesModel')); 
crypyDB.on('error', error => console.error('crypyDB connection error:', error));


const inboxDB = mongoose.createConnection(process.env.DATABASE_SECURED_INBOX); 78
inboxDB.on('connected', () => {
  console.log('InboxDB > Email database connected.');
});

// inboxDB.model('SentEmail', require('./models/emailModel')); 
inboxDB.on('error', error => console.error('inboxDB connection error:', error));

// Export both database connections
module.exports = { crypyDB, inboxDB };
