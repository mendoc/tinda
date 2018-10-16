const nodemailer = require('nodemailer');
const constants  = require('inc/constants');

const mail = {

    send: function (data, to, callback) {

        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport(constants.transport);

            let mailOptions = {
                from: constants.from,
                to: to,
                subject: data.subject,
                html: data.body
            };

            transporter.sendMail(mailOptions, callback);
        });
    }
};

module.exports.mail = mail;