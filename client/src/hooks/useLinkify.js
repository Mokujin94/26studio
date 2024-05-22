const validTLDs = ["com", "org", "net", "edu", "gov", "uk", "ru"]; // Добавьте другие допустимые TLD

const isValidURL = (url) => {
	try {
		const parsedUrl = new URL(url.startsWith("http") ? url : `http://${url}`);
		const domainParts = parsedUrl.hostname.split(".");
		const tld = domainParts[domainParts.length - 1].toLowerCase();
		return validTLDs.includes(tld);
	} catch (_) {
		return false;
	}
};

export const useLinkify = (text) => {
	// Регулярное выражение для поиска потенциальных ссылок
	const urlRegex = /(\b(https?:\/\/|www\.)?([a-z0-9-]+\.[a-z]{2,})(\/[^\s]*)?\b)/gi;
	return text.split(urlRegex).map((part, index) => {
		if (urlRegex.test(part)) {
			const url = part.startsWith("http") ? part : `http://${part}`;
			return isValidURL(url) ? <a key={index} href={url} target="_blank" rel="noopener noreferrer">{part}</a> : part;
		}
		return part;
	});
}