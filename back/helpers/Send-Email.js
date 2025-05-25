const dotenv = require('dotenv');
dotenv.config();
// // Configure SMTP transporter
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.NODEMAILER_EMAIL, // Your email
//         pass: process.env.NODEMAILER_PASSWORD  // Your email app password
//     }
// });

// // Function to send email
// const sendEmail = async (to, subject, htmlContent) => {
//     try {
//         await transporter.sendMail({
//             from: process.env.NODEMAILER_EMAIL,
//             to,
//             subject,
//             html: htmlContent
//         });
//         console.log("Email sent successfully!");
//     } catch (error) {
//         console.error("Error sending email:", error);
//     }
// };

// module.exports = sendEmail;





// const loadTemplate = require("./emailTemplates");

// // Configure email sender
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.NODEMAILER_EMAIL,
//         pass: process.env.NODEMAILER_PASSWORD
//     }
// });

// // Function to send email using templates
// const sendEmail = async (to, subject, templateName, replacements, attachments = []) => {
//     try {
//         const htmlContent = loadTemplate(templateName, replacements);

//         await transporter.sendMail({
//             from: process.env.NODEMAILER_EMAIL,
//             to,
//             subject,
//             html: htmlContent,
//             attachments: attachments // Attach QR codes

//         });

//         console.log("Email sent successfully!");
//     } catch (error) {
//         console.error("Error sending email:", error);
//     }
// };

// module.exports = sendEmail;


const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, templateName, templateData) => {
  let text = '';
  let html = '';

  switch (templateName) {
    case 'welcomeEmail':
      text = `Hello ${templateData.name},\n\nWelcome to EMS! We're glad to have you onboard.`;
      html = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2>Welcome to EMS!</h2>
          <p>Hello ${templateData.name},</p>
          <p>We're glad to have you onboard.</p>
        </div>
      `;
      break;

    case 'otpEmail':
      text = `Your EMS verification code is: ${templateData.otp}`;
      html = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2>Email Verification</h2>
          <p>Your EMS verification code is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #2c3e50;">${templateData.otp}</p>
          <p>This code will expire shortly. Please do not share it with anyone.</p>
           <p style="font-size: 14px; color: #666;">
        If you didn't request this, simply ignore this message.
      </p>
      <p style="font-size: 14px; color: #666;">
        Yours,<br/>
        The EMS Team
      </p>
        </div>
      `;
      break;

    default:
      text = `Hello,\n\nThis is a notification from EMS.`;
      html = `<p>Hello,</p><p>This is a notification from EMS.</p>`;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `"EMS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;

