const nodemailer = require('nodemailer');

exports.sendMail = (mailOptions) => {

    const transporter = nodemailer.createTransport({
        service : 'Gmail',
        host: 'smtp.mailtrap.io',
        secure: false,
        port: 587,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    return transporter.sendMail(mailOptions);
}