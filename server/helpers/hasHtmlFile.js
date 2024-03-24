function hasHtmlFile(filePaths) {
	for (const filePath of filePaths) {
		if (/\.html$/i.test(filePath)) {
			return true;
		}
	}
	return false;
}

module.exports = hasHtmlFile;