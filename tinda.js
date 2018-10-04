const nodemailer = require('nodemailer');

const mail = {
    transport: {
        host: 'ssl0.ovh.net',
        port: 587,
        secure: false,
        auth: {
            user: "dimitri@ecole241.org",
            pass: "OlaLabs241"
        }
    },
    send: function (data, to, callback) {

        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: 'ssl0.ovh.net',
                port: 587,
                secure: false,
                auth: {
                    user: "dimitri@ecole241.org",
                    pass: "OlaLabs241"
                }
            });

            let mailOptions = {
                from: data.from,
                to: to,
                subject: data.subject,
                html: data.body
            };

            transporter.sendMail(mailOptions, callback);
        });
    }
};

module.exports.mail = mail;