import { useDateFormatter } from '../../hooks/useDateFormatter';
import { useCountFormatter } from '../../hooks/useCountFormatter';
import style from './githubRepoCard.module.scss';

const GithubRepoCard = ({ repo }) => {
	const formatedDate = useDateFormatter(repo.updated_at);

	// Цвета для популярных языков программирования
	const languageColors = {
		JavaScript: '#f1e05a',
		TypeScript: '#3178c6',
		Python: '#3572A5',
		Java: '#b07219',
		'C++': '#f34b7d',
		C: '#555555',
		'C#': '#178600',
		PHP: '#4F5D95',
		Ruby: '#701516',
		Go: '#00ADD8',
		Rust: '#dea584',
		Swift: '#F05138',
		Kotlin: '#A97BFF',
		HTML: '#e34c26',
		CSS: '#563d7c',
		SCSS: '#c6538c',
		Vue: '#41b883',
		Shell: '#89e051',
		Dart: '#00B4AB',
	};

	const languageColor = languageColors[repo.language] || '#8b949e';

	return (
		<a 
			href={repo.html_url} 
			target="_blank" 
			rel="noopener noreferrer" 
			className={style.githubRepoCard}
		>
			<div className={style.githubRepoCard__header}>
				<div className={style.githubRepoCard__icon}>
					<svg viewBox="0 0 16 16" fill="currentColor">
						<path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
					</svg>
				</div>
				<h3 className={style.githubRepoCard__name}>{repo.name}</h3>
			</div>

			{repo.description && (
				<p className={style.githubRepoCard__description}>{repo.description}</p>
			)}

			{repo.topics && repo.topics.length > 0 && (
				<div className={style.githubRepoCard__topics}>
					{repo.topics.slice(0, 4).map((topic) => (
						<span key={topic} className={style.githubRepoCard__topic}>
							{topic}
						</span>
					))}
				</div>
			)}

			<div className={style.githubRepoCard__footer}>
				<div className={style.githubRepoCard__stats}>
					{repo.language && (
						<div className={style.githubRepoCard__stat}>
							<span 
								className={style.githubRepoCard__languageDot}
								style={{ backgroundColor: languageColor }}
							/>
							<span>{repo.language}</span>
						</div>
					)}
					<div className={style.githubRepoCard__stat}>
						<svg viewBox="0 0 16 16" fill="currentColor">
							<path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
						</svg>
						<span>{useCountFormatter(repo.stargazers_count)}</span>
					</div>
					<div className={style.githubRepoCard__stat}>
						<svg viewBox="0 0 16 16" fill="currentColor">
							<path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
						</svg>
						<span>{useCountFormatter(repo.forks_count)}</span>
					</div>
				</div>
				<span className={style.githubRepoCard__date}>{formatedDate}</span>
			</div>

			<div className={style.githubRepoCard__githubBadge}>
				<svg viewBox="0 0 16 16" fill="currentColor">
					<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
				</svg>
			</div>
		</a>
	);
};

export default GithubRepoCard;

