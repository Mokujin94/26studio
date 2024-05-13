const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "26studio.college@gmail.com",
            pass: "jmxbxygojrrprmew",
        },
    },
    {
        from: "26Studio <26studio.college@gmail.com>",
    }
);

const mailer = (message) => {
    transporter.sendMail(message, (err, info) => {
        if (err) return

    });
};

module.exports = mailer;
