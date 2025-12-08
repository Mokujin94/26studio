import React, { useContext, useEffect, useRef, useState } from "react";

import projectPhoto from "../../resource/graphics/images/projectCard/bg.jpg";

import ProjectCard from "../projectCard/ProjectCard";
import { observer } from "mobx-react-lite";
import { fetchProjectsUser } from "../../http/projectAPI";
import { fetchUserById, fetchGithubRepos } from "../../http/userAPI";
import { Link, useLocation, useParams } from "react-router-dom";
import { PROJECTS_ROUTE } from "../../utils/consts";

import style from './profileProjects.module.scss'
import { Context } from "../..";
import NewProjectCard from "../newProjectCard/NewProjectCard";
import GithubRepoCard from "../githubRepoCard/GithubRepoCard";
import ProjectSkeleton from "../ProjectSkeleton";
import Skeleton from "../Skeletons/Skeleton";

const ProfileProjects = observer(({ isOnSetting }) => {
	const { profile, user } = useContext(Context)
	const { id } = useParams();
	const location = useLocation();
	const [dataProjects, setDataProjects] = useState([]);
	const [githubRepos, setGithubRepos] = useState([]);
	const [activeTab, setActiveTab] = useState('projects');
	const [isLoadingGithub, setIsLoadingGithub] = useState(false);
	const [profileUser, setProfileUser] = useState(null);

	useEffect(() => {
		fetchProjectsUser(id).then((data) => setDataProjects(data.projects));
		
		// Получаем данные пользователя для github_username
		fetchUserById(id).then((userData) => {
			setProfileUser(userData);
			if (userData.github_username) {
				setIsLoadingGithub(true);
				fetchGithubRepos(userData.github_username)
					.then((repos) => {
						setGithubRepos(repos);
					})
					.catch((err) => {
						console.log('Ошибка при загрузке GitHub репозиториев:', err);
					})
					.finally(() => {
						setIsLoadingGithub(false);
					});
			}
		});
	}, [location.pathname]);

	const skeletonList = [
		{ id: 0 },
		{ id: 1 },
		{ id: 2 },
		{ id: 3 },
	];

	const newSkeletonList = skeletonList.map(({ id }) => (
		<Skeleton key={id} width={267} height={234} backgroundColor={"#222c36"} />
	));

	const hasGithub = profileUser?.github_username && githubRepos.length > 0;

	const renderProjects = () => (
		<>
			{
				user.user.id == id && dataProjects.length
					?
					<div className={profile.isOnSetting ? "profile__left-content-settings profile__left-content-settings_active" : "profile__left-content-settings"} onClick={() => profile.setIsOnSetting(!profile.isOnSetting)}>
						<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
							<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
							<g id="SVGRepo_iconCarrier">
								<path fillRule="evenodd" clipRule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="#1C274C"></path>
							</g>
						</svg>
					</div>
					: null
			}
			{
				dataProjects.length
					?
					(
						dataProjects.map((item) => {
							return (
								<Link className={profile.isOnSetting ? style.projectCardLink + " " + style.projectCardLink_isOnSetting : style.projectCardLink}
									to={PROJECTS_ROUTE + "/" + item.id}
									key={item.id}
								>
									<NewProjectCard
										id={item.id}
										img={item.preview}
										title={item.name}
										name={item.user.name}
										date={item.start_date}
										like={item.likes.length}
										view={item.views.length}
										comment={item.comments.length}
										user={item.user}
										baseURL={item.baseURL}
										pathFromProject={item.path_from_project}
										dataProjects={dataProjects}
										setDataProjects={setDataProjects}
									/>
								</Link>
							);
						})
					)
					:
					(
						<div className={style.projects}>
							<div className={style.projects__icon}>
								<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
									viewBox="0 0 32 32" xmlSpace="preserve">
									<path d="M6,27h21c1.1,0,2-0.9,2-2V11c0-1.1-0.9-2-2-2l-9.5,0" />
									<path d="M28.5,26.3L17.5,9L15,5h-2.5H5C3.9,5,3,5.9,3,7v17" />
									<path d="M7.5,15.5c-1.9,1.9-1.9,5.1,0,7c0.5,0.5,1,0.8,1.6,1.1c1.8,0.7,3.9,0.4,5.4-1.1c1.9-1.9,1.9-5.1,0-7 S9.5,13.6,7.5,15.5z"/>
									<path d="M6.5,21l-3.9,3.6c-0.8,0.8-0.8,2,0,2.8l0,0c0.8,0.8,2,0.8,2.8,0l3.5-3.5" />
								</svg>
							</div>
							<h2 className={style.projects__title}>Нет проектов</h2>
						</div>
					)
			}
		</>
	);

	const renderGithubRepos = () => (
		<>
			{isLoadingGithub ? (
				newSkeletonList
			) : githubRepos.length > 0 ? (
				<div className={style.githubRepos}>
					{githubRepos.map((repo) => (
						<GithubRepoCard key={repo.id} repo={repo} />
					))}
				</div>
			) : (
				<div className={style.projects}>
					<div className={style.projects__icon}>
						<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
						</svg>
					</div>
					<h2 className={style.projects__title}>Нет репозиториев</h2>
				</div>
			)}
		</>
	);

	return (
		<>
			{
				profile.isLoadingProfile
					?
					newSkeletonList
					:
					<>
						{/* Табы для переключения между проектами и GitHub */}
						{(hasGithub || profileUser?.github_username) && (
							<div className={style.tabs}>
								<button 
									className={`${style.tabs__item} ${activeTab === 'projects' ? style.tabs__item_active : ''}`}
									onClick={() => setActiveTab('projects')}
								>
									<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 9.5H21M3 14.5H21M8 4.5V19.5M16 4.5V19.5M6.2 19.5H17.8C18.9201 19.5 19.4802 19.5 19.908 19.282C20.2843 19.0903 20.5903 18.7843 20.782 18.408C21 17.9802 21 17.4201 21 16.3V7.7C21 6.5799 21 6.01984 20.782 5.59202C20.5903 5.21569 20.2843 4.90973 19.908 4.71799C19.4802 4.5 18.9201 4.5 17.8 4.5H6.2C5.0799 4.5 4.51984 4.5 4.09202 4.71799C3.71569 4.90973 3.40973 5.21569 3.21799 5.59202C3 6.01984 3 6.57989 3 7.7V16.3C3 17.4201 3 17.9802 3.21799 18.408C3.40973 18.7843 3.71569 19.0903 4.09202 19.282C4.51984 19.5 5.07989 19.5 6.2 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									Проекты {dataProjects.length > 0 && `(${dataProjects.length})`}
								</button>
								<button 
									className={`${style.tabs__item} ${activeTab === 'github' ? style.tabs__item_active : ''}`}
									onClick={() => setActiveTab('github')}
								>
									<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
									</svg>
									GitHub {githubRepos.length > 0 && `(${githubRepos.length})`}
								</button>
							</div>
						)}

						{activeTab === 'projects' ? renderProjects() : renderGithubRepos()}
					</>
			}
		</>
	);
});

export default ProfileProjects;
