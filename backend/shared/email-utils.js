const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

async function sendEmail(to, subject, message) {
  if (!to) throw new Error("Recipient email (to) is required!");
  if (!subject) throw new Error("Subject is required!");
  if (!message) throw new Error("message is required!");

  try {
    const info = await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to,
      subject,
      text: message,
    });

    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending meail: ", error);
    throw error;
  }
}

module.exports = sendEmail;
