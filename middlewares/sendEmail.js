const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b4c280a5e535af",
          pass: "c15d3b806b56ec"
        }
      });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};