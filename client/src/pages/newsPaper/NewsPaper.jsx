import React, { useContext, useEffect, useState } from 'react';
import Description from '../../components/description/Description';
import Comments from '../../components/comments/Comments';
import NewsPaperContent from '../../components/newsPaperContent/NewsPaperContent';
import NewsPaperHeader from '../../components/newsPaperHeader/NewsPaperHeader';
import AmountComponent from '../../components/amountComponent/AmountComponent';

import like from '../../resource/graphics/icons/newsCard/likes.svg';
import view from '../../resource/graphics/icons/newsCard/views.svg';
import com from '../../resource/graphics/icons/newsCard/comments.svg';

import './newsPaper.scss';
import { useParams } from 'react-router-dom';
import { Context } from '../..';
import { fetchNewsById } from '../../http/newsAPI';

function NewsPaper() {
  const [oneNews, setOneNews] = useState({});

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    fetchNewsById(id).then((data) => {
      setOneNews(data);
    });
  }, []);
  return (
    <div className="container">
      <div className="news-paper">
        <h2 className="news-paper__title">{oneNews.title}</h2>
        <div className="news-paper__content">
          <NewsPaperContent img={process.env.REACT_APP_API_URL + oneNews.img} />
          <Comments />
        </div>
        <div className="news-paper__info">
          <Description title="Описание" descr={oneNews.description} />
        </div>
        <div className="news-paper__bottom">
          <AmountComponent img={like} value="54" />
          <AmountComponent img={view} value="5256" />
        </div>
      </div>
    </div>
  );
}

export default NewsPaper;
