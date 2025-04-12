import nodemailer from "nodemailer";
import userModel  from '../models/user.model.js';

// const sendMail = async (to, subject, text) => {
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         secure: true,
//         port: 465,
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     await transporter.sendMail({
//         from: `"ALVEN" <${process.env.EMAIL}>`,
//         to,
//         subject,
//         text
//     });
// }


const sendMail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ALVEN" <${process.env.EMAIL}>`,
    to,
    subject,
    html: htmlContent, // Use `html` instead of `text` to send HTML content
  });
};



export default sendMail;
