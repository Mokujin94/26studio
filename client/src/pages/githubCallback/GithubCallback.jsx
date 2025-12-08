import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Context } from "../..";
import { githubCallback, linkGithubAccount } from "../../http/userAPI";
import { NEWS_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from "../../utils/consts";
import Spinner from "../../components/spinner/Spinner";
import "./githubCallback.scss";

function GithubCallback() {
	const { user } = useContext(Context);
	const [searchParams] = useSearchParams();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "Авторизация через GitHub";
		
		const code = searchParams.get("code");
		
		if (!code) {
			setError("Код авторизации не получен");
			setLoading(false);
			return;
		}

		const handleCallback = async () => {
			try {
				// Проверяем, это привязка аккаунта или авторизация
				const linkAccountUserId = localStorage.getItem('github_link_account');
				
				if (linkAccountUserId) {
					// Привязка GitHub к существующему аккаунту
					localStorage.removeItem('github_link_account');
					const data = await linkGithubAccount(code, linkAccountUserId);
					user.setUser(data);
					navigate(PROFILE_ROUTE + '/' + linkAccountUserId);
				} else {
					// Обычная авторизация через GitHub
					const data = await githubCallback(code);
					user.setUser(data);
					user.setAuth(true);
					navigate(NEWS_ROUTE);
				}
			} catch (err) {
				localStorage.removeItem('github_link_account');
				setError(err.response?.data?.message || "Ошибка авторизации через GitHub");
				setLoading(false);
			}
		};

		handleCallback();
	}, [searchParams, user, navigate]);

	if (loading) {
		return (
			<div className="github-callback">
				<div className="github-callback__content">
					<Spinner />
					<p className="github-callback__text">Выполняется авторизация через GitHub...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="github-callback">
				<div className="github-callback__content">
					<div className="github-callback__error">
						<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
							<path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
						</svg>
						<p>{error}</p>
					</div>
					<button 
						className="github-callback__btn"
						onClick={() => navigate(LOGIN_ROUTE)}
					>
						Вернуться на страницу входа
					</button>
				</div>
			</div>
		);
	}

	return null;
}

export default GithubCallback;


