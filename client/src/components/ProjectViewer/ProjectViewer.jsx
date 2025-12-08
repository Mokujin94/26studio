import { useEffect, useState } from "react";
import { fetchProject } from "../../http/projectAPI";

import style from "./projectViewer.module.scss";
import Spinner from "../spinner/Spinner";

const ProjectViewer = ({ pathFromProject, baseURL, styles, styleWrap, useDirectUrl = false }) => {
	const [htmlContent, setHtmlContent] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [directUrl, setDirectUrl] = useState("");

	useEffect(() => {
		if (!pathFromProject || !baseURL) return;
		
		setIsLoading(true);
		
		// Проверяем, является ли это React/Vue проектом (путь содержит dist или build)
		const isBuiltProject = pathFromProject.includes('/dist/') || 
			pathFromProject.includes('/build/') ||
			pathFromProject.includes('\\dist\\') ||
			pathFromProject.includes('\\build\\');
		
		if (isBuiltProject || useDirectUrl) {
			// Для собранных React/Vue проектов используем прямой URL
			// Формируем URL к index.html
			let correctedPath = baseURL.replace(/\\/g, "/");
			correctedPath = correctedPath.replace(/^\.\//, "");
			correctedPath = correctedPath.replace(/^http:\/(?!\/)/, "http://");
			correctedPath = correctedPath.replace(/^https:\/(?!\/)/, "https://");
			
			// Добавляем index.html если его нет в конце
			if (!correctedPath.endsWith('index.html')) {
				correctedPath = correctedPath.endsWith('/') 
					? correctedPath + 'index.html' 
					: correctedPath + '/index.html';
			}
			
			setDirectUrl(correctedPath);
			setIsLoading(false);
		} else {
			// Для обычных HTML проектов используем srcDoc
			fetchProject(pathFromProject, baseURL).then((data) => {
				setHtmlContent(data);
				setIsLoading(false);
			}).catch(() => {
				// Fallback на прямой URL при ошибке
				let correctedPath = baseURL.replace(/\\/g, "/");
				correctedPath = correctedPath.replace(/^\.\//, "");
				correctedPath = correctedPath.replace(/^http:\/(?!\/)/, "http://");
				correctedPath = correctedPath.replace(/^https:\/(?!\/)/, "https://");
				if (!correctedPath.endsWith('index.html')) {
					correctedPath = correctedPath.endsWith('/') 
						? correctedPath + 'index.html' 
						: correctedPath + '/index.html';
				}
				setDirectUrl(correctedPath);
				setIsLoading(false);
			});
		}
	}, [pathFromProject, baseURL, useDirectUrl]);
	
	return (
		<div className={style.wrap} style={styleWrap}>
			{isLoading ? (
				<Spinner />
			) : directUrl ? (
				<iframe
					title="Project Content"
					className={style.iframe}
					src={directUrl}
					style={styles}
					sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
				/>
			) : (
				<iframe
					title="Project Content"
					className={style.iframe}
					srcDoc={htmlContent}
					style={styles}
				/>
			)}
		</div>
	);
};

export default ProjectViewer;
