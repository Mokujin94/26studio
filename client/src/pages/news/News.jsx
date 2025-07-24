import React, { useContext, useEffect, useState } from "react";
import NewsCard from "../../components/newsCard/NewsCard";
import { Context } from "../../index";
import { NEWSPAPER_ROUTE } from "../../utils/consts";

import "./news.scss";

import { Link } from "react-router-dom";
import NewsSkeleton from "../../components/newsSkeleton/NewsSkeleton";
import { fetchNews } from "../../http/newsAPI";
import { observer } from "mobx-react-lite";
import Skeleton from "../../components/Skeletons/Skeleton";

const News = observer(() => {
	const { news } = useContext(Context);
	const [isLoaded, setIsLoaded] = useState(true);
	const [newsCollection, setNewsCollection] = useState();

	useEffect(() => {
		document.title = "Новости";
		fetchNews()
			.then((data) => {
				news.setNews(data.rows);
				setNewsCollection(
					news.news.map((item) => (
						<Link key={item.id} to={NEWSPAPER_ROUTE + "/" + item.id} rel="noopener noreferrer">
							<NewsCard news={item} />
						</Link>
					))
				);
				setIsLoaded(false);
			})
			.catch((err) => console.log(err));
	}, []);

	const skeletonList = [
		{ id: 0 },
		{ id: 1 },
		{ id: 2 },
		{ id: 3 },
		{ id: 4 },
		{ id: 5 },
		{ id: 6 },
		{ id: 7 },
		{ id: 8 },
		{ id: 9 },
	];

	const newSkeletonList = skeletonList.map(({ id }) => (
		<Skeleton key={id} width={308} height={257} />
	));

	return (
		<div className="container">
			<div className="news">
				<div className="news__title-wrapper">
					<h1 className="news__title">Последние новости</h1>
				</div>
				<div className="news__cards">
					{isLoaded ? newSkeletonList : newsCollection}
				</div>
			</div>
		</div>
	);
});

export default News;
