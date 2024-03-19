import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import CommentsInput from "../commentsInput/CommentsInput";
import NewsComment from "../newsComment/NewsComment";

import style from "./comments.module.scss";
import { useDateFormatter } from "../../hooks/useDateFormatter";

const Comments = ({ comments, setComments, projectId, newsId }) => {

	const [lastReplyComment, setLastReplyComment] = useState({});
	const [commentsCout, setCommentsCout] = useState(0)

	useEffect(() => {
		// const socket = socketIOClient("https://26studio-production.up.railway.app");
		const socket = socketIOClient(process.env.REACT_APP_API_URL);
		// Подписываемся на событие обновления комментариев
		if (projectId) {
			socket.on("sendCommentsToClients", (updatedComments) => {
				if (updatedComments) {
					if (updatedComments.projectId == projectId) {
						setComments((item) => [...item, updatedComments]);
					}
				}
			});
		}
		if (newsId) {
			socket.on("sendCommentsNewsToClients", (updatedComments) => {
				if (updatedComments) {
					if (updatedComments.newsId == newsId) {
						setComments((item) => [...item, updatedComments]);
					}
				}
			});
		}

		socket.on("replyComment", (newComment) => {
			if (newComment) {
				setLastReplyComment(newComment);

			}
		})

		console.log(comments)


		// Закрываем соединение при размонтировании компонента
		return () => {
			socket.disconnect();
		};
	}, []); // Пустой массив зависимостей гарантирует, что эффект будет вызван только при монтировании компонента

	useEffect(() => {
		let count = 0;
		console.log(comments);
		comments.map(item => {
			if (item.replyes) {
				count += item.replyes.length + 1;
			} else {
				count += 1
			}
		})
		setCommentsCout(count);
	}, [comments])

	return (
		<div className={style.block}>
			<div className={style.block__title}>Комментарии ({commentsCout})</div>
			<CommentsInput projectId={projectId} newsId={newsId} />
			<div className={style.block__comments}>
				{comments.length ? comments.map((item) => {
					return (
						<NewsComment
							id={item.userId}
							name={item.user.name}
							avatar={item.user.avatar}
							comment={item.message}
							commentId={item.id}
							projectId={item.projectId}
							replyes={item.replyes}
							lastReplyComment={lastReplyComment}
							date={useDateFormatter(item.createdAt)}
							key={item.id}
							likes={item.likes}
						/>
					);
				})
					:
					<span className={style.block__comments__text}>Нет комментариев</span>
				}
			</div>

		</div>
	);
};

export default Comments;
