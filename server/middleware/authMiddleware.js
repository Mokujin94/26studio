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



		// Проверка userId
		if (req.body.userId && req.user.id !== Number(req.body.userId)) {
			return res.status(403).json({ message: "Запрещено. Невозможно выполнить запрос от имени другого пользователя."});
		}

		next();
	} catch (e) {
		res.status(403).json({ message: "Не авторизован" });
	}
};

