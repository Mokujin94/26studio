const jwt = require("jsonwebtoken");

module.exports = function (roleIds) {
	return function (req, res, next) {
		if (req.method === "OPTIONS") {
			next();
		}
		try {
			const token = req.headers.authorization.split(" ")[1];
			if (!token) {
				return res.status(401).json({ message: "Не авторизован" });
			}
			const decoded = jwt.verify(token, process.env.SECRET_KEY);
			console.log(decoded.roleId);
			if (Array.isArray(roleIds)) {
				if (!roleIds.includes(decoded.roleId)) {
					return res.status(403).json({ message: "Нет доступа" });
				}
			} else {
				if (decoded.roleId !== roleIds) {
					return res.status(403).json({ message: "Нет доступа" });
				}
			}
			req.user = decoded;
			next();
		} catch (e) {
			res.status(403).json({ message: "Не авторизован" });
		}
	};
};