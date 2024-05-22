const { parse } = require("html-metadata-parser");
const axios = require('axios');
const ApiError = require("../error/ApiError");
const { load } = require("cheerio");

class LinkController {

	async getPreview(req, res, next) {
		const { url } = req.query;
		try {
			const { data } = await axios.get(url);
			const $ = load(data);
			// const metadata = await parse(url);

			const getMetaTag = (name) => {
				return (
					$(`meta[name=${name}]`).attr("content") ||
					$(`meta[propety="twitter${name}"]`).attr("content") ||
					$(`meta[property="og:${name}"]`).attr("content")
				);
			};

			const preview = {
				url,
				title: $("title").first().text(),
				favicon:
					$('link[rel="shortcut icon"]').attr("href") ||
					$('link[rel="alternate icon"]').attr("href"),
				description: getMetaTag("description"),
				image: getMetaTag("image"),
				author: getMetaTag("author"),
			};
			res.status(200).json(preview);
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

}

module.exports = new LinkController();