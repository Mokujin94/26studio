const axios = require('axios');
const ApiError = require("../error/ApiError");
const { load } = require("cheerio");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 100 }); // 100 секунд TTL
const { URL } = require('url');

class LinkController {

	async getPreview(req, res, next) {
		const { url } = req.query;
		if (!url) {
			return next(ApiError.badRequest('URL is required'));
		}

		// Проверка кэша
		if (cache.has(url)) {
			return res.json(cache.get(url));
		}

		try {
			const response = await axios.get(url);
			const $ = load(response.data);

			const getMetaTag = (names) => {
				for (const name of names) {
					const content = $(`meta[property="og:${name}"]`).attr("content") ||
						$(`meta[property="twitter:${name}"]`).attr("content") ||
						$(`meta[name="twitter:${name}"]`).attr("content") ||
						$(`meta[name="${name}"]`).attr("content");
					if (content) return content;
				}
				return null;
			};

			const makeAbsoluteUrl = (base, relative) => {
				if (!relative) return null;
				return new URL(relative, base).href;
			};

			const faviconRelativeUrl =
				$('link[rel="shortcut icon"]').attr("href") ||
				$('link[rel="alternate icon"]').attr("href") ||
				$('link[rel="icon"]').attr("href");

			const preview = {
				url,
				title: $("title").first().text() || getMetaTag(["title"]),
				favicon: makeAbsoluteUrl(url, faviconRelativeUrl),
				description: getMetaTag(["description"]),
				image: makeAbsoluteUrl(url, getMetaTag(["image", "image_src"])),
				author: getMetaTag(["author"]),
				ogTitle: getMetaTag(["title"]),
				ogDescription: getMetaTag(["description"]),
				ogImage: makeAbsoluteUrl(url, getMetaTag(["image"])),
				ogSiteName: getMetaTag(["site_name"])
			};

			// Добавление данных в кэш
			cache.set(url, preview);

			res.status(200).json(preview);
		} catch (e) {
			next(ApiError.badRequest(e.message));

		}
	}
}

module.exports = new LinkController();
