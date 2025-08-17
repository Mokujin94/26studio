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
		if (err) {
			console.error("MAIL ERROR:", err); // <-- логируем
			return;
		}
		console.log("MAIL OK:", info.response);
	});
};

module.exports = mailer;
