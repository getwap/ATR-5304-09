const nodemailer = require("nodemailer");
require("dotenv").config({ path: "config-secured.env" });
const cheerio = require("cheerio");
const sentEmails = require("../models/emailModel");

const domainEnvMap = {
  "vapor-edge": "VAPOREDGE", // using this formate as example
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
  // Check if emailMessage is a string

  // console.log('Type of emailMessage:', typeof emailMessage);
  // Check if emailMessage is a string
  if (typeof emailMessage !== "string") {
    throw new Error("Email message must be a string");
  }
  const { username, domain } = getEmailDetails(emailFrom);

  // const domain  = domainEnvMap[domain.toLowerCase()] || domain;

  const host = process.env[`EMAIL_HOST_${domain}`];
  const user = process.env[`EMAIL_USERNAME_${domain}_${username}`];
  const pass = process.env[`EMAIL_PASSWORD_${domain}_${username}`];

  // console.log('Host:', host);
  console.log("Username:", user);
  // console.log('Password:', pass);
  console.log("Message sent:", emailMessage);

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
  });

  try {
    // Extract text from HTML message
    const textMessage = extractTextFromHtml(emailMessage);
    const emailResponse = await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: textMessage,
      html: emailMessage,
    });
    // Create a new EmailSent document and save it
    const sentEmail = new sentEmails({
      emailFrom,
      emailTo,
      cc: "",
      bcc: "",
      emailSubject,
      emailMessage,
    });
    await sentEmail.save();

    console.log("Email sent:", emailResponse.messageId);
    return { success: true, messageId: emailResponse.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
}

module.exports = { sendEmail };
