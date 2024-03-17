import ejs from 'ejs';
import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url'; 

const __dirname = dirname(fileURLToPath(import.meta.url));


const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  
  async function sendEmail(data) {
    try {
      const { meal_ordered, stud_fn, stud_ln, location, email } = data;
  
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.COPY_EMAIL,
        subject: "New Order Received",
        html: `
              <p>Hello,</p>
              <p>A new order has been received:</p>
              <ul>
                  <li>Meal Ordered: ${meal_ordered}</li>
                  <li>Student First Name: ${stud_fn}</li>
                  <li>Student Last Name: ${stud_ln}</li>
                  <li>Location: ${location}</li>
                  <li>Email: ${email}</li>
              </ul>
          `,
      });
  
      console.log("Message sent: %s", info.messageId);
      return info.messageId;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  
  export { sendEmail };