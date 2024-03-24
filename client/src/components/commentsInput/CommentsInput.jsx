import React, { useContext, useRef, useState } from "react";

import style from "./commentsInput.module.scss";
import { Context } from "../..";
import { createNews, createProject } from "../../http/commentsAPI";
import Spinner from "../spinner/Spinner";

function CommentsEnd({ projectId, newsId }) {
	const { user, error } = useContext(Context);

	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [notEmpty, setNotEmpty] = useState(false)

	const inputRef = useRef(null)

	const sendMessage = async (e) => {
		e.preventDefault();
		if (!user.isAuth) {
			return error.setNotAuthError(true);
		}

		if (message.replace(/\s/g, "")) {
			setIsLoading(true);
			if (projectId) {
				await createProject(message, projectId, user.user.id)
					.then(() => {
						setMessage("");
						setIsLoading(false);
						inputRef.current.innerText = '';
						setNotEmpty(false)
					})
					.catch((err) => {
						console.log(err.response.data.message);
						error.setNotAuthError(true);
						setIsLoading(false);
					});
			}
			if (newsId) {
				await createNews(message, newsId, user.user.id)
					.then(() => {
						setMessage("");
						setIsLoading(false);
						inputRef.current.innerText = '';
						setNotEmpty(false)
					})
					.catch((err) => {
						console.log(err.response.data.message);
						console.log(err)
						error.setNotAuthError(true);
						setIsLoading(false);
					});
			}
		}
	};

	const onInput = (e) => {
		const content = e.target.innerText;
		const formattedContent = content.trim();
		const filteredContent = formattedContent.normalize("NFD");

		setMessage(filteredContent);

		const regex = /<br>/g;
		const matches = e.target.innerHTML.match(regex);
		const hasLineBreaks = matches ? matches.length > 1 : false;

		// Проверяем, что filteredContent содержит символы, отличные от пробелов
		if (filteredContent.trim().length > 0 || hasLineBreaks) {
			setNotEmpty(true);
		} else {
			setNotEmpty(false);
		}
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
			e.preventDefault(); // Предотвращает перевод строки
			sendMessage(e)
		}
	};

	return (
		<form className={style.block}>
			{/* <input
				className={style.block__input}
				type="text"
				placeholder="Напишите текст"
				onChange={(e) => setMessage(e.target.value)}
				value={message}
			/> */}
			<div style={{ width: "100%", position: "relative" }}>
				<div
					className={notEmpty ? style.block__input + " " + style.block__input_notEmpty : style.block__input}
					contentEditable={true}
					onInput={onInput}
					onKeyDown={handleKeyPress}
					ref={inputRef}
				>
				</div>
				<div className={style.block__input_line}></div>
			</div>
			<button
				type="submit"
				className={style.block__btn}
				onClick={(e) => sendMessage(e)}
				disabled={isLoading || !notEmpty || message.length === 0}
			>
				{isLoading ? <Spinner /> : "Отправить"}
			</button>
		</form>
	);
}

export default CommentsEnd;
