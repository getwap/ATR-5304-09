const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const Imap = require("imap-simple");
const emailSentSchema = require("../models/emailModel");
const SendEmail = require("../utils/emailer.js");

const EmailSent = mongoose.model("EmailSent", emailSentSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yohannesdejene23@gmail.com",
    pass: "yodej0946",
  },
});

// DELETE WHEN DONE, and uncommend the default dashboard/schedule
// route.get('/', (req, res, next) => {
//     res.render('inbox/emails', {  layout: 'layouts/layout', page_title: 'Emails', folder: 'Inbox' });
// })

router.get("/inbox/emails", (req, res, next) => {
  function activeClass(linkUrl) {
    return req.path === linkUrl ? "active" : "";
  }
  res.render("inbox/emails", {
    layout: "layouts/layout",
    page_title: "Emails",
    folder: "Inbox",
    activeClass: activeClass,
  });
});

router.get("/inbox/sentEmails", (req, res, next) => {
  function activeClass(linkUrl) {
    return req.path === linkUrl ? "active" : "";
  }
  res.render("inbox/emailsSent", {
    layout: "layouts/layout",
    page_title: "Emails",
    folder: "Inbox",
    activeClass: activeClass,
  });
});

router.get("/inbox/sent-emails", async (req, res) => {
  try {
    // Query the MongoDB collection to fetch sent emails
    const sentEmails = await EmailSent.find();
    console.log("sentEmails", sentEmails);
    // Return the fetched emails as a response
    res.status(200).json({ success: true, emails: sentEmails });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Error fetching sent emails" });
  }
});
router.post("/inbox/sendEmail", async (req, res) => {
  try {
    console.log("req.body", req.body);
    console.log("email sending t4st");
    const mailOptions = {
      from: "yohannesdejene23@gmail.com",
      to: req.body.to,
      // to: "yohannesdejene23@gmail.com",
      subject: req.body.subject,
      // subject: "this is the message for testing",
      text: req.body.body,
      // text: "this is the body of the email",
    };

    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       return console.log(error);
    //     }
    const result = await SendEmail(
      req.body.to,
      req.body.subject,
      req.body.body
    );
    if (
      req.body?.ccRecipients &&
      req.body?.ccRecipients !== "" &&
      req.body?.ccRecipients !== "undefined"
    ) {
      console.log("in the ccreciepeints poage", req.body?.ccRecipients);
      const cResult = await SendEmail(
        req.body.ccRecipients,
        req.body.subject,
        req.body.body
      );
    }
    if (
      req.body?.bbRecipients &&
      req.body?.bbRecipients !== "" &&
      req.body?.bbRecipients !== "undefined"
    ) {
      console.log("bbRecipients page", req.body?.bbRecipients);
      const bResult = await SendEmail(
        req.body.bbRecipients,
        req.body.subject,
        req.body.body
      );
    }

    console.log("reched here");
    const email = new EmailSent({
      emailFrom: mailOptions.from,
      emailTo: mailOptions.to,
      emailSubject: mailOptions.subject,
      emailMessage: mailOptions.text,
      cc: req.body?.ccRecipients,
      bcc: req.body?.bbRecipients,
      sentOn: new Date(),
    });

    await email.save();
    console.log("Email details saved to MongoDB");
    res.status(200).json({ success: true, message: "Email sent " });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error sending email" });
  }

  //   email.save((err) => {
  //     if (err) {
  //       res.send(err);
  //       console.log(err);
  //     } else {
  //       console.log("email sent");
  //       res.redirect("/");
  //     }
  //   });

  //   });
});

module.exports = router;
