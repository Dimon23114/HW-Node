const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_USER, META_PASSWORD, BASE_URL } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_USER,
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendMail = async (userName, userEmail, verificationToken) => {
  const emailOptions = {
    from: META_USER,
    to: userEmail,
    subject: "Confirm email",
    html: `<p>${userName}, verify your email to continue using the application</p><a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`,
  };

  try {
    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;