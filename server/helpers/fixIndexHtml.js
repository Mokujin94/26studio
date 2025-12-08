const fs = require("fs");
const path = require("path");

/**
 * Исправляет пути во всех файлах сборки для корректной работы в iframe
 * Заменяет абсолютные пути и BASE_URL на относительные
 * @param {string} buildFolderPath - путь к папке сборки (dist/build)
 * @param {string} baseHref - не используется, оставлено для совместимости
 * @returns {boolean} - успешно ли выполнена операция
 */
function addBaseHref(buildFolderPath, baseHref) {
	try {
		// Если передан путь к index.html, получаем папку
		let folderPath = buildFolderPath;
		if (buildFolderPath.endsWith("index.html")) {
			folderPath = path.dirname(buildFolderPath);
		}

		if (!fs.existsSync(folderPath)) {
			console.error("Папка сборки не найдена:", folderPath);
			return false;
		}

		// Обрабатываем index.html
		const indexHtmlPath = path.join(folderPath, "index.html");
		if (fs.existsSync(indexHtmlPath)) {
			fixFile(indexHtmlPath);
		}

		// Обрабатываем JS файлы в папке assets
		const assetsPath = path.join(folderPath, "assets");
		if (fs.existsSync(assetsPath)) {
			processFolder(assetsPath);
		}

		// Также проверяем static/js
		const staticJsPath = path.join(folderPath, "static", "js");
		if (fs.existsSync(staticJsPath)) {
			processFolder(staticJsPath);
		}

		console.log("Пути исправлены в папке:", folderPath);
		return true;
	} catch (error) {
		console.error("Ошибка при исправлении путей:", error);
		return false;
	}
}

/**
 * Обрабатывает все файлы в папке
 */
function processFolder(folderPath) {
	const files = fs.readdirSync(folderPath);
	for (const file of files) {
		const filePath = path.join(folderPath, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			processFolder(filePath);
		} else if (
			file.endsWith(".js") ||
			file.endsWith(".html") ||
			file.endsWith(".css")
		) {
			fixFile(filePath);
		}
	}
}

/**
 * Исправляет пути в одном файле
 */
function fixFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, "utf-8");
		const originalContent = content;

		// Заменяем абсолютные пути на относительные в HTML атрибутах
		content = content.replace(/src="\//g, 'src="./');
		content = content.replace(/src='\//g, "src='./");
		content = content.replace(/href="\//g, 'href="./');
		content = content.replace(/href='\//g, "href='./");

		// Заменяем пути вида "/assets/" и "/static/" на относительные
		content = content.replace(/"\/assets\//g, '"./assets/');
		content = content.replace(/'\/assets\//g, "'./assets/");
		content = content.replace(/"\/static\//g, '"./static/');
		content = content.replace(/'\/static\//g, "'./static/");

		// Удаляем любые нестандартные BASE_URL (типа /telegram-clone/, /app/ и т.д.)
		// Заменяем BASE_URL:"/anything/" на BASE_URL:"./"
		content = content.replace(/BASE_URL:"\/[^"]+\/"/g, 'BASE_URL:"./"');
		content = content.replace(/BASE_URL:'\/[^']+\/'/g, "BASE_URL:'./'");

		// Заменяем пути вида "./telegram-clone/assets/" на "./assets/"
		// Находим любые пути вида "./название-проекта/assets/" или "./название-проекта/static/"
		content = content.replace(/"\.\/([\w-]+)\/(assets|static)\//g, '"./$2/');
		content = content.replace(/'\.\/([\w-]+)\/(assets|static)\//g, "'./$2/");

		// Также заменяем "\/название-проекта\/assets" (экранированные слеши в JSON)
		content = content.replace(/"\\\/([\w-]+)\\\/(assets|static)/g, '"\\/$2');

		// Записываем только если были изменения
		if (content !== originalContent) {
			fs.writeFileSync(filePath, content, "utf-8");
			console.log("Исправлен файл:", filePath);
		}
	} catch (error) {
		console.error("Ошибка при обработке файла:", filePath, error);
	}
}

module.exports = { addBaseHref };
