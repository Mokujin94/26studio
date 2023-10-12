import React, { useContext, useEffect, useState } from "react";
import NewsCard from "../../components/newsCard/NewsCard";
import { Context } from "../../index";
import { NEWSPAPER_ROUTE } from "../../utils/consts";

import "./news.scss";

import img from "../../resource/graphics/images/newsCard/preview.jpg";
import avatar from "../../resource/graphics/images/newsCard/avatar.jpg";
import { Link } from "react-router-dom";
import NewsSkeleton from "../../components/newsSkeleton/NewsSkeleton";

function News() {
  const { news } = useContext(Context);
  const skeletonList = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];

  const newSkeletonList = skeletonList.map(({ id }) => (
    <NewsSkeleton key={id} />
  ));
  const [isLoaded, setIsLoaded] = useState(true);
  const [newsCollection, setNewsCollection] = useState();
  useEffect(() => {
    setTimeout(() => {
      setNewsCollection(
        news.news.map((news) => (
          <Link key={news.id} to={NEWSPAPER_ROUTE + "/" + news.id}>
            <NewsCard
              title={news.title}
              description={news.description}
              img={news.img}
              avatar={avatar}
              likes={news.amount_likes}
              comments={news.amount_comments}
              views={news.amount_views}
            />
          </Link>
        ))
      );
      setIsLoaded(false);
    }, 1000);
  }, []);
  return (
    <div className="container">
      <div className="news">
        <div className="news__title-wrapper">
          <h1 className="news__title">Популярные новости</h1>
        </div>
        <div className="news__cards">
          {isLoaded ? newSkeletonList : newsCollection}
        </div>
      </div>
    </div>
  );
}

export default News;
