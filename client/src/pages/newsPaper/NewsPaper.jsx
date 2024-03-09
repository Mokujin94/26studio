import React, { useContext, useEffect, useState } from "react";
import Description from "../../components/description/Description";
import Comments from "../../components/comments/Comments";
import NewsPaperContent from "../../components/newsPaperContent/NewsPaperContent";
import NewsPaperHeader from "../../components/newsPaperHeader/NewsPaperHeader";
import AmountComponent from "../../components/amountComponent/AmountComponent";

import socketIOClient from "socket.io-client";

import "./newsPaper.scss";
import { useParams } from "react-router-dom";
import { Context } from "../..";
import { condidate, deleteLike, fetchNewsById, like } from "../../http/newsAPI";
import { getAllCommentsNews } from "../../http/commentsAPI";
import { observer } from "mobx-react-lite";
import { useCountFormatter } from "../../hooks/useCountFormatter";
import { viewNews } from "../../http/viewAPI";

const NewsPaper = observer(() => {
	const { user, error } = useContext(Context);

	const [newsData, setNewsData] = useState({});

	const [amountLike, setAmountLike] = useState([]);
	const [comments, setComments] = useState([]);
	const [views, setViews] = useState([]);
	const [description, setDescription] = useState([]);
	const [isLike, setIsLike] = useState(false);
	const [likeLoading, setLikeLoading] = useState(false);

	const formatedViews = useCountFormatter(views.length);

	const { id } = useParams();

	useEffect(() => {
		viewNews(id, user.user.id).catch((e) => console.log(e));
		getAllCommentsNews(id).then((data) => {
			setComments(data[0].comments);
		});

		fetchNewsById(id).then((data) => {
			setNewsData(data);
			const lines = data.description.split('\r\n');
			setDescription(lines)
			setAmountLike(() => useCountFormatter(data.likes.length));
			data.likes.filter((item) => {
				if (item.userId === user.user.id && item.status) {
					setIsLike(true);
				}
			});
			setViews(() => useCountFormatter(data.views.length));
		});

		// const socket = socketIOClient("https://26studio-production.up.railway.app");
		const socket = socketIOClient(process.env.REACT_APP_API_URL);

		socket.on("sendViewsNewsToClients", (updatedViews) => {
			if (updatedViews) {
				updatedViews.filter((item) => {
					if (item.id == id) {
						setViews(updatedViews[0].views);
					}
				});
			}
		});

		// Закрываем соединение при размонтировании компонента
		return () => {
			socket.disconnect();
		};
	}, [location.pathname, user.user.id]);

	const setLike = async () => {
		setLikeLoading(true);
		await condidate(id, user.user.id)
			.then(async (dataCondidate) => {
				if (dataCondidate.length) {
					await deleteLike(id, user.user.id)
						.then(() => {
							setIsLike(false);
							setAmountLike((amountLike) => Number(amountLike) - 1);
							setLikeLoading(false);
						})
						.catch((data) => {
							console.log(data.response.data.message);
							error.setNotAuthError(true);
							setLikeLoading(false)
						});
				} else {
					await like(id, user.user.id)
						.then(() => {
							setIsLike(true);
							setAmountLike((amountLike) => Number(amountLike) + 1);
							setLikeLoading(false);
						})
						.catch((data) => {
							console.log(data.response.data.message);
							error.setNotAuthError(true);
							setLikeLoading(false)
						});
				}
			})
			.catch((data) => {
				console.log(data.response.data.message);
				error.setNotAuthError(true);
				setLikeLoading(false)
			});
	};

	const likeIcon = (style) => {
		return (
			<svg
				className={
					isLike
						? style.block__img + " " + style.block__img__active
						: style.block__img
				}
				width="22"
				height="22"
				viewBox="0 0 22 22"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5.5 0C3.9875 0 2.64 0.741935 1.6225 1.90323C0.6325 3.06452 0 4.64516 0 6.45161C0 8.22581 0.6325 9.80645 1.6225 11L11 22L20.3775 11C21.3675 9.83871 22 8.25806 22 6.45161C22 4.67742 21.3675 3.09677 20.3775 1.90323C19.3875 0.741935 18.04 0 16.5 0C14.9875 0 13.64 0.741935 12.6225 1.90323C11.6325 3.06452 11 4.64516 11 6.45161C11 4.67742 10.3675 3.09677 9.3775 1.90323C8.3875 0.741935 7.04 0 5.5 0Z"
					fill="white"
				/>
			</svg>
		);
	};

	const view = (style) => {
		return (
			<svg
				className={style.block__img}
				width="22"
				height="15"
				viewBox="0 0 22 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M11.0825 0C4.125 0 0 7.5 0 7.5C0 7.5 4.125 15 11.0825 15C17.875 15 22 7.5 22 7.5C22 7.5 17.875 0 11.0825 0ZM11 2.5C14.0525 2.5 16.5 4.75 16.5 7.5C16.5 10.275 14.0525 12.5 11 12.5C7.975 12.5 5.5 10.275 5.5 7.5C5.5 4.75 7.975 2.5 11 2.5ZM11 5C9.4875 5 8.25 6.125 8.25 7.5C8.25 8.875 9.4875 10 11 10C12.5125 10 13.75 8.875 13.75 7.5C13.75 7.25 13.64 7.025 13.585 6.8C13.365 7.2 12.925 7.5 12.375 7.5C11.605 7.5 11 6.95 11 6.25C11 5.75 11.33 5.35 11.77 5.15C11.5225 5.075 11.275 5 11 5Z"
					fill="white"
				/>
			</svg>
		);
	};
	return (
		<div className="container">
			<div className="news-paper">
				<div className="news-paper__header">
					<h2 className="news-paper__title">{newsData.title}</h2>
					<div className="news-paper__activity">
						<AmountComponent
							img={likeIcon}
							value={amountLike}
							onClick={setLike}
							likeLoading={likeLoading}
						/>
						<AmountComponent img={view} value={formatedViews} />
					</div>
				</div>
				<div className="news-paper__content">
					<NewsPaperContent
						img={process.env.REACT_APP_API_URL + newsData.img}
					/>
					<Description title="Описание" descr={description} />
				</div>
				<div className="news-paper__info">
					<Comments comments={comments} setComments={setComments} newsId={id} />
				</div>

			</div>
		</div>
	);
});

export default NewsPaper;
