const mongoose = require("mongoose");
// const inboxDB = mongoose.createConnection(process.env.DATABASE_SECURED_INBOX);

const emailSentSchema = new mongoose.Schema({
  sentOn: {
    type: Date,
    default: Date.now,
  },
  emailFrom: {
    type: String,
    required: true,
  },
  emailTo: {
    type: String,
    required: true,
  },
  cc: String,
  bcc: String,
  emailSubject: String,
  emailMessage: String,
});

const emailReceivedSchema = new mongoose.Schema({
  receivedOn: {
    type: Date,
    default: Date.now,
  },
  emailFrom: {
    type: String,
  },
  emailTo: {
    type: String,
  },
  cc: String,
  bcc: String,
  emailSubject: String,
  emailMessage: String,
});

// }, { collection: 'emails_received' });

// const SentEmail = mongoose.model('EmailSent', emailSentSchema, 'emails_sent');
// module.exports = SentEmails;
// // module.exports = emailSentSchema;
// module.exports = mongoose.model('SentEmail', emailSentSchema);
// // module.exports = mongoose.model('sentEmails', emailSentSchema);
// module.exports = sentEmails; // This exports the model

// const SentEmail = mongoose.model('SentEmail', emailSentSchema);
// const ReceivedEmail = mongoose.model('ReceivedEmail', emailReceivedSchema);
// const ReceivedEmail = mongoose.model('ReceivedEmail', emailReceivedSchema, 'emails_received');

// module.exports = { SentEmail, ReceivedEmail };
// const SentEmail = inboxDB.model('EmailSent', emailSentSchema, 'emails_sent');

// const SentEmail = inboxDB.model('SentEmail', emailSentSchema);
// const ReceivedEmail = inboxDB.model('ReceivedEmail', emailReceivedSchema);

// const SentEmails = inboxDB.model('emails_sent', emailSentSchema);
// const ReceivedEmails = inboxDB.model('emails_received', emailReceivedSchema);
// module.exports = { SentEmail, ReceivedEmail };

// const SentEmail = mongoose.model('SentEmail', emailSentSchema);
module.exports = emailSentSchema;

// module.exports = { emailSentSchema, emailReceivedSchema };
