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

import image1 from '../../resource/graphics/images/newsCard/preview.jpg'
import ContentStats from "../../components/contentStats/ContentStats";

const NewsPaper = observer(() => {
	const { user, error } = useContext(Context);

	const [newsData, setNewsData] = useState({});

	const [amountLike, setAmountLike] = useState([]);
	const [comments, setComments] = useState([]);
	const [views, setViews] = useState([]);
	const [content, setContent] = useState([]);
	const [isLike, setIsLike] = useState(false);
	const [likeLoading, setLikeLoading] = useState(false);

	const { id } = useParams();

	useEffect(() => {
		if (user.user.id) {
			viewNews(id, user.user.id).catch((e) => console.log(e));
		}
		getAllCommentsNews(id).then((data) => {
			setComments(data[0].comments);
		});

		fetchNewsById(id).then((data) => {
			setNewsData(data);
			console.log(JSON.parse(data.description))
			const filteredDescription = JSON.parse(data.description)
				.map(item => {
					if (item.type === "paragraph") {
						// Добавляем атрибут target="_blank" для тегов <a>
						const textWithBlankTarget = item.data.text.replace(/<a/g, '<a target="_blank"');
						return { ...item, data: { ...item.data, text: textWithBlankTarget } };
					}
					return item
				});
			setContent(filteredDescription)
			setAmountLike(data.likes.length);
			data.likes.filter((item) => {
				if (item.userId === user.user.id && item.status) {
					setIsLike(true);
				}
			});
			setViews(data.views);
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

	return (
		<div className="container">
			<div className="news-paper">
				<div className="news-paper__inner">
					<h1 className="news-paper__title">{newsData.title}</h1>
					{content.map(item => {
						if (item.type === "paragraph") {
							return (
								<p
									key={item.id}
									className="news-paper__descr"
									dangerouslySetInnerHTML={{ __html: item.data.text }}
								/>
							)
						}
						if (item.type === "image") {
							if (!item.data.caption.length) {
								return (
									<div className={
										`news-paper__image-item 
										${item.data.stretched ? "news-paper__image-item_stretched" : ''} 
										${item.data.withBackground ? "news-paper__image-item_bg" : ''} 
										${item.data.withBorder ? "news-paper__image-item_border" : ''}`}
									>
										<img src={item.data.file.url} alt="" />
									</div>
								)
							}
							return (
								<figure key={item.id} className="news-paper__image">
									<div className={
										`news-paper__image-item 
										${item.data.stretched ? "news-paper__image-item_stretched" : ''} 
										${item.data.withBackground ? "news-paper__image-item_bg" : ''} 
										${item.data.withBorder ? "news-paper__image-item_border" : ''}`}
									>
										<img src={item.data.file.url} alt="" />
									</div>
									<caption className="news-paper__image-caption">{item.data.caption}</caption>
								</figure>
							)
						}
					})}
				</div>


				<div className="news-paper__header">
					{
						newsData.user
						&&
						<ContentStats
							dataUser={newsData.user}
							onClick={setLike}
							likes={amountLike}
							isLike={isLike}
							views={views}
							likeLoading={likeLoading}
							date={newsData.createdAt}
							isNews={true}
						/>
					}
				</div>

				<div className="news-paper__comments">
					<Comments
						comments={comments}
						setComments={setComments}
						newsId={id}
					/>
				</div>
			</div>


		</div>
	);
});

export default NewsPaper;
