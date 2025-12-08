import React, { useState, useEffect, useCallback } from "react";
import { fetchProjectFiles, fetchProjectFileContent } from "../../http/projectAPI";
import Spinner from "../spinner/Spinner";
import style from "./codeViewer.module.scss";

// Иконки для типов файлов
const FileIcon = ({ extension }) => {
	const getIcon = () => {
		switch (extension) {
			case "html":
				return (
					<svg viewBox="0 0 24 24" fill="none" className={style.fileIcon}>
						<path d="M4 3L5.77778 20L12 22L18.2222 20L20 3H4Z" stroke="#E34F26" strokeWidth="1.5"/>
						<path d="M12 6V18L16.5 16.5L17.5 6H7L7.5 10H15L14.5 14L12 15" stroke="#E34F26" strokeWidth="1.5"/>
					</svg>
				);
			case "css":
			case "scss":
			case "sass":
			case "less":
				return (
					<svg viewBox="0 0 24 24" fill="none" className={style.fileIcon}>
						<path d="M4 3L5.77778 20L12 22L18.2222 20L20 3H4Z" stroke="#1572B6" strokeWidth="1.5"/>
						<path d="M16 7H8L8.5 10H15.5L14.5 15L12 16L9.5 15L9.25 13" stroke="#1572B6" strokeWidth="1.5"/>
					</svg>
				);
			case "js":
			case "jsx":
				return (
					<svg viewBox="0 0 24 24" fill="none" className={style.fileIcon}>
						<rect x="3" y="3" width="18" height="18" rx="2" stroke="#F7DF1E" strokeWidth="1.5"/>
						<path d="M9 15V10M15 10V13C15 14.1046 14.1046 15 13 15H12" stroke="#F7DF1E" strokeWidth="1.5"/>
					</svg>
				);
			case "ts":
			case "tsx":
				return (
					<svg viewBox="0 0 24 24" fill="none" className={style.fileIcon}>
						<rect x="3" y="3" width="18" height="18" rx="2" stroke="#3178C6" strokeWidth="1.5"/>
						<path d="M8 10H14M11 10V15M16 10V15" stroke="#3178C6" strokeWidth="1.5"/>
					</svg>
				);
			case "json":
				return (
					<svg viewBox="0 0 24 24" fill="none" className={style.fileIcon}>
						<path d="M8 4C6 4 5 5 5 7V10C5 11 4 12 3 12C4 12 5 13 5 14V17C5 19 6 20 8 20" stroke="#F5C06A" strokeWidth="1.5"/>
						<path d="M16 4C18 4 19 5 19 7V10C19 11 20 12 21 12C20 12 19 13 19 14V17C19 19 18 20 16 20" stroke="#F5C06A" strokeWidth="1.5"/>
					</svg>
				);
			case "md":
				return (
					<svg viewBox="0 0 24 24" fill="none" className={style.fileIcon}>
						<rect x="3" y="5" width="18" height="14" rx="2" stroke="#519aba" strokeWidth="1.5"/>
						<path d="M6 15V9L9 12L12 9V15M15 12H18M16.5 9V15" stroke="#519aba" strokeWidth="1.5"/>
					</svg>
				);
			case "svg":
				return (
					<svg viewBox="0 0 24 24" fill="none" className={style.fileIcon}>
						<rect x="3" y="3" width="18" height="18" rx="2" stroke="#FFB13B" strokeWidth="1.5"/>
						<circle cx="12" cy="12" r="4" stroke="#FFB13B" strokeWidth="1.5"/>
					</svg>
				);
			default:
				return (
					<svg viewBox="0 0 24 24" fill="none" className={style.fileIcon}>
						<path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5"/>
						<path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5"/>
					</svg>
				);
		}
	};
	return getIcon();
};

const FolderIcon = ({ isOpen }) => (
	<svg viewBox="0 0 24 24" fill="none" className={style.folderIcon}>
		{isOpen ? (
			<path d="M22 19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H9L11 6H20C21.1046 6 22 6.89543 22 8V19Z" stroke="#F5C06A" strokeWidth="1.5" fill="rgba(245, 192, 106, 0.1)"/>
		) : (
			<path d="M22 19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H9L11 6H20C21.1046 6 22 6.89543 22 8V19Z" stroke="#F5C06A" strokeWidth="1.5"/>
		)}
	</svg>
);

// Компонент элемента файлового дерева
const FileTreeItem = ({ item, depth, selectedFile, onFileSelect, expandedFolders, onToggleFolder }) => {
	const isFolder = item.type === "folder";
	const isExpanded = expandedFolders[item.path];
	const isSelected = selectedFile === item.path;

	const handleClick = () => {
		if (isFolder) {
			onToggleFolder(item.path);
		} else {
			onFileSelect(item.path, item.name);
		}
	};

	return (
		<div className={style.treeItem}>
			<div
				className={`${style.treeItemRow} ${isSelected ? style.selected : ""}`}
				style={{ paddingLeft: `${depth * 16 + 8}px` }}
				onClick={handleClick}
			>
				{isFolder && (
					<span className={`${style.chevron} ${isExpanded ? style.expanded : ""}`}>
						<svg viewBox="0 0 24 24" fill="none">
							<path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2"/>
						</svg>
					</span>
				)}
				{isFolder ? (
					<FolderIcon isOpen={isExpanded} />
				) : (
					<FileIcon extension={item.extension} />
				)}
				<span className={style.itemName}>{item.name}</span>
			</div>
			{isFolder && isExpanded && item.children && (
				<div className={style.treeChildren}>
					{item.children.map((child) => (
						<FileTreeItem
							key={child.path}
							item={child}
							depth={depth + 1}
							selectedFile={selectedFile}
							onFileSelect={onFileSelect}
							expandedFolders={expandedFolders}
							onToggleFolder={onToggleFolder}
						/>
					))}
				</div>
			)}
		</div>
	);
};

// Функция для определения языка по расширению
const getLanguage = (filename) => {
	const ext = filename.split('.').pop().toLowerCase();
	const languageMap = {
		'html': 'html',
		'htm': 'html',
		'css': 'css',
		'scss': 'scss',
		'sass': 'sass',
		'less': 'less',
		'js': 'javascript',
		'jsx': 'javascript',
		'ts': 'typescript',
		'tsx': 'typescript',
		'json': 'json',
		'md': 'markdown',
		'xml': 'xml',
		'svg': 'xml',
		'php': 'php',
		'py': 'python',
		'rb': 'ruby',
		'java': 'java',
		'c': 'c',
		'cpp': 'cpp',
		'h': 'c',
		'hpp': 'cpp',
		'cs': 'csharp',
		'go': 'go',
		'rs': 'rust',
		'swift': 'swift',
		'kt': 'kotlin',
		'yaml': 'yaml',
		'yml': 'yaml',
		'txt': 'text',
	};
	return languageMap[ext] || 'text';
};

const CodeViewer = ({ projectPath }) => {
	const [files, setFiles] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedFileName, setSelectedFileName] = useState("");
	const [fileContent, setFileContent] = useState("");
	const [isLoadingFiles, setIsLoadingFiles] = useState(true);
	const [isLoadingContent, setIsLoadingContent] = useState(false);
	const [expandedFolders, setExpandedFolders] = useState({});
	const [error, setError] = useState(null);

	// Загрузка списка файлов
	useEffect(() => {
		if (!projectPath) return;

		setIsLoadingFiles(true);
		setError(null);

		// Передаём полный путь, сервер сам определит директорию
		fetchProjectFiles(projectPath)
			.then((data) => {
				setFiles(data);
				// Автоматически раскрываем первую папку
				if (data.length > 0 && data[0].type === "folder") {
					setExpandedFolders({ [data[0].path]: true });
				}
			})
			.catch((err) => {
				console.error("Error loading project files:", err);
				setError("Не удалось загрузить файлы проекта");
			})
			.finally(() => {
				setIsLoadingFiles(false);
			});
	}, [projectPath]);

	// Загрузка содержимого файла
	const handleFileSelect = useCallback(async (filePath, fileName) => {
		if (!projectPath) return;

		setSelectedFile(filePath);
		setSelectedFileName(fileName);
		setIsLoadingContent(true);
		setFileContent("");

		try {
			// Передаём полный путь, сервер сам определит директорию
			const data = await fetchProjectFileContent(projectPath, filePath);
			if (data.isBinary) {
				setFileContent("// Бинарный файл не может быть отображён");
			} else {
				setFileContent(data.content);
			}
		} catch (err) {
			console.error("Error loading file content:", err);
			setFileContent("// Ошибка загрузки файла");
		} finally {
			setIsLoadingContent(false);
		}
	}, [projectPath]);

	const handleToggleFolder = useCallback((path) => {
		setExpandedFolders((prev) => ({
			...prev,
			[path]: !prev[path]
		}));
	}, []);

	// Подсветка синтаксиса (простая версия)
	const highlightCode = (code, language) => {
		if (!code) return [];

		const lines = code.split('\n');
		return lines.map((line, index) => ({
			number: index + 1,
			content: line || ' '
		}));
	};

	const codeLines = highlightCode(fileContent, getLanguage(selectedFileName));

	if (error) {
		return (
			<div className={style.codeViewer}>
				<div className={style.errorMessage}>{error}</div>
			</div>
		);
	}

	return (
		<div className={style.codeViewer}>
			{/* Файловое дерево */}
			<div className={style.sidebar}>
				<div className={style.sidebarHeader}>
					<svg viewBox="0 0 24 24" fill="none" className={style.headerIcon}>
						<path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="1.5"/>
					</svg>
					<span>Файлы проекта</span>
				</div>
				<div className={style.fileTree}>
					{isLoadingFiles ? (
						<div className={style.loading}>
							<Spinner />
						</div>
					) : (
						files.map((item) => (
							<FileTreeItem
								key={item.path}
								item={item}
								depth={0}
								selectedFile={selectedFile}
								onFileSelect={handleFileSelect}
								expandedFolders={expandedFolders}
								onToggleFolder={handleToggleFolder}
							/>
						))
					)}
				</div>
			</div>

			{/* Просмотр кода */}
			<div className={style.codePanel}>
				{selectedFile ? (
					<>
						<div className={style.codeHeader}>
							<div className={style.tabs}>
								<div className={style.tab}>
									<FileIcon extension={selectedFileName.split('.').pop()} />
									<span>{selectedFileName}</span>
								</div>
							</div>
						</div>
						<div className={style.codeContent}>
							{isLoadingContent ? (
								<div className={style.loading}>
									<Spinner />
								</div>
							) : (
								<pre className={style.codeBlock}>
									<code className={`language-${getLanguage(selectedFileName)}`}>
										{codeLines.map((line) => (
											<div key={line.number} className={style.codeLine}>
												<span className={style.lineNumber}>{line.number}</span>
												<span className={style.lineContent}>{line.content}</span>
											</div>
										))}
									</code>
								</pre>
							)}
						</div>
					</>
				) : (
					<div className={style.placeholder}>
						<svg viewBox="0 0 24 24" fill="none" className={style.placeholderIcon}>
							<path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5"/>
							<path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5"/>
							<path d="M8 13H16M8 17H12" stroke="currentColor" strokeWidth="1.5"/>
						</svg>
						<span>Выберите файл для просмотра</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default CodeViewer;

