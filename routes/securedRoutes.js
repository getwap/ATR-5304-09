const express = require("express");
const route = express.Router();
const { sendEmail } = require("../controllers/emailController");
// const dotenv = require('../config-secured.env');
// const emailSentSchema = require("../models/emailModel");
// const EmailSent = inboxDB.model('SentEmail', emailSentSchema);
// const sentEmails = inboxDB.model('SentEmail', require("../models/emailModel"));
// const sentEmails = require("../models/emailModel");

// Route to send emails
route.post("/send-email", async (req, res) => {
  const { emailFrom, emailTo, emailSubject, emailMessage } = req.body;

  try {
    const emailResult = await sendEmail({
      emailFrom,
      emailTo,
      emailSubject,
      emailMessage,
    });
    res.json(emailResult);
  } catch (error) {
    console.error("Route Email Sending Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
// // Route to get emails by domain
// route.get('/emails/:domain', async (req, res) => {
//     const { domain } = req.params;
//     try {
//         const emails = await getEmails(domain);
//         res.json(emails);
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });
// Route to trigger email fetching
// route.get('/fetch-emails', async (req, res) => {
//     try {
//         await emailController.receiveEmails();
//         res.status(200).send('Emails fetching initiated successfully.');
//     } catch (error) {
//         console.error('Failed to fetch emails:', error);
//         res.status(500).send('Failed to initiate emails fetching.');
//     }
// });

module.exports = route;
