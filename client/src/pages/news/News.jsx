import React, { useContext } from "react";
import NewsCard from "../../components/newsCard/NewsCard";
import { Context } from "../../index";
import { NEWSPAPER_ROUTE } from "../../utils/consts";

import "./news.scss";

import img from "../../resource/graphics/images/newsCard/preview.jpg";
import avatar from "../../resource/graphics/images/newsCard/avatar.jpg";
import { Link } from "react-router-dom";

function News() {
  const { news } = useContext(Context);
  return (
    <div className="container">
      <div className="news">
        <div className="news__title-wrapper">
          <h1 className="news__title">Популярные новости</h1>
          <div className="news__propose">Предложить новость</div>
        </div>
        <div className="news__cards">
          {news.news.map((news) => (
            <Link to={NEWSPAPER_ROUTE + "/:id"}>
              <NewsCard
                key={news.id}
                title={news.title}
                description={news.description}
                img={news.img}
                avatar={avatar}
                likes={news.amount_likes}
                comments={news.amount_comments}
                views={news.amount_views}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
