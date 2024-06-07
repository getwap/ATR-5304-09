const nodemailer = require("nodemailer");
const googleapis = require("googleapis");

const { google } = googleapis;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

console.log("REFRESH_TOKEN finl", REFRESH_TOKEN);
console.log("CLIENT_ID", CLIENT_ID);
console.log("REDIRECT_URI", REDIRECT_URI);
console.log("CLIENT_SECRET", CLIENT_SECRET);
// Create a new OAuth2 client with the configured keys.
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to send email
async function sendEmail(recipientEmail, subject, message) {
  try {
    // Message object

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "yohannesdejene23@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    let mailOptions = {
      from: "yohannesdejene23@gmail.com",
      to: recipientEmail,
      subject: subject,
      // text: message,
      html: message,
      // Sending email
    };
    let info = await transport.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending message:", error);
  }
}

// export default sendEmail;
module.exports = sendEmail;
