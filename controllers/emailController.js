const nodemailer = require("nodemailer");
const cheerio = require("cheerio");
const { inboxDB } = require("../dbStrings-secured");
// const emailSentSchema = require('../models/emailModel');
// const sendEmail = inboxDB.model('sendEmail', emailSentSchema);
const emailSentSchema = require("../models/emailModel");
// const { SentEmail, saveEmail } = require('../models/emailModel');
// const { SentEmail } = require('../models/emailModel');

const Imap = require("imap");
const { simpleParser } = require("mailparser");

const domainEnvMap = {
  enterpriselux: "ENTERPRISELUX",
  "vapor-edge": "VAPOREDGE",
  mendozaspreciousmetals: "MENDOZASPRECIOUSMETALS",
  "white-nirvana": "WHITENIRVANA",
};

// Extract domain and role from the email address
function getEmailDetails(email) {
  const parts = email.split("@");
  const usernamePart = parts[0]; // This is the 'admin', 'support', etc. part.
  let domainPart = parts[1].split(".")[0]; // This is domain, like 'enterpriselux', part.

  domainPart =
    domainEnvMap[domainPart.toLowerCase()] ||
    domainPart.replace(/[^a-z0-9]/gi, "").toUpperCase();

  return { domain: domainPart, username: usernamePart.toUpperCase() };
}
// Function to extract text from HTML content
function extractTextFromHtml(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const textContent = $.text();
  return textContent;
}
// Function to send email
async function sendEmail({ emailFrom, emailTo, emailSubject, emailMessage }) {
  const { username, domain } = getEmailDetails(emailFrom);
  const host = process.env[`EMAIL_HOST_${domain}`];
  const user = process.env[`EMAIL_USERNAME_${domain}_${username}`];
  const pass = process.env[`EMAIL_PASSWORD_${domain}_${username}`];

  console.log("Username:", user);
  console.log("Message:", emailMessage);

  if (!host || !user || !pass) {
    console.error("Missing configuration for:", emailFrom);
    throw new Error("Configuration error: Missing credentials");
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: 587, // 587 for testing, 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: { user: user, pass: pass },
    tls: { rejectUnauthorized: false },
    // debug: true,
    // logger: true
  });

  try {
    // Extract text from HTML message
    const textMessage = extractTextFromHtml(emailMessage);
    const emailResponse = await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      // cc: cc,
      // bcc: bcc,
      subject: emailSubject,
      text: textMessage,
      html: emailMessage,
    });
    console.log("Email sent:", emailResponse.messageId);
    await saveEmail({ domain, emailFrom, emailTo, emailSubject, emailMessage });
    return { success: true, messageId: emailResponse.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
}
async function saveEmail({
  domain,
  emailFrom,
  emailTo,
  emailSubject,
  emailMessage,
}) {
  const collectionName = `emails_sent_${domain.toLowerCase()}`;
  const newEmailModel = inboxDB.model(
    "SentEmail",
    emailSentSchema,
    collectionName
  );

  const emailData = new newEmailModel({
    emailFrom,
    emailTo,
    emailSubject,
    emailMessage,
  });

  try {
    // const savedEmail = await emailData.save();
    // console.log('Email saved:', savedEmail);
    return { success: true, message: "Email saved successfully" };
  } catch (error) {
    console.error("Error saving email:", error);
    throw new Error("Failed to save email");
  }
}

// ------------------------ Receive Emails ------------------------ //
// fetch emails from the database
// async function getEmails(domain) {
//     try {
//         return await emails_sent.find({ emailDomain: domain });
//     } catch (error) {
//         throw new Error('Failed to fetch emails');
//     }
// }
// function getEmailDetails(email) {
//     const [usernamePart, domainPart] = email.split('@');
//     const domain = domainEnvMap[domainPart.split('.')[0].toLowerCase()] || domainPart;
//     return { domain, username: usernamePart.toUpperCase() };
// }
// function extractTextFromHtml(htmlContent) {
//     const $ = cheerio.load(htmlContent);
//     return $.text();
// }
// // IMAP connection to listen for new emails
// async function receiveEmails() {
//     const imapConfig = {
//         user: process.env.EMAIL_USERNAME_MENDOZASPRECIOUSMETALS_SUPPORT,
//         password: process.env.EMAIL_PASSWORD_MENDOZASPRECIOUSMETALS_SUPPORT,
//         host: process.env.EMAIL_HOST_MENDOZASPRECIOUSMETALS,
//         port: 993,
//         tls: false, // true for 465, false for other ports
//         authTimeout: 3000
//     };

//     const imap = new Imap(imapConfig);
//     imap.once('ready', () => {
//         imap.openBox('INBOX', false, (err, box) => {
//             if (err) throw err;
//             imap.search(['UNSEEN'], (err, results) => {
//                 if (err || !results.length) {
//                     console.log('No unread mails');
//                     imap.end();
//                     return;
//                 }
//                 const fetch = imap.fetch(results, { bodies: '' });
//                 fetch.on('message', (msg) => {
//                     msg.on('body', (stream) => {
//                         simpleParser(stream, async (err, mail) => {
//                             if (err) {
//                                 console.error('Mail parsing error:', err);
//                                 return;
//                             }
//                             console.log('Received email:', mail.subject);
//                             // Assuming you want to save the email too
//                             await saveEmail({
//                                 emailFrom: mail.from.text,
//                                 emailTo: mail.to.text,
//                                 emailSubject: mail.subject,
//                                 emailMessage: mail.text
//                             });
//                         });
//                     });
//                 });
//                 fetch.once('end', () => {
//                     console.log('Done fetching all messages!');
//                     imap.end();
//                 });
//             });
//         });
//     });

//     imap.once('error', (err) => {
//         console.error('IMAP error:', err);
//     });

//     imap.connect();
// }

// module.exports = { sendEmail, saveEmail, receiveEmails }
// module.exports = { sendEmail };

module.exports = { sendEmail, saveEmail };
