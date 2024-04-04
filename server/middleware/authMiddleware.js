const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
	if (req.method === "OPTIONS") {
		next();
		return; // Выйти из middleware для OPTIONS запросов
	}

	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(401).json({ message: "Не авторизован" });
		}

		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decoded;
		console.log(req)
		if (req.originalUrl === '/api/friend/' && req.method === "PATCH") {
			if (Number(req.body.friendId) && Number(req.body.friendId) !== decoded.id) {
				return res.status(403).json({ message: "Доступ запрещен" });
			}
		} else {
			if (Number(req.body.userId) && Number(req.body.userId) !== decoded.id) {
				return res.status(403).json({ message: "Доступ запрещен" });
			}
		}




		next();
	} catch (e) {
		res.status(403).json({ message: "Не авторизован" });
	}
};

