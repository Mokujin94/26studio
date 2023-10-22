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
  const [newsData, setNewsData] = useState({});

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    fetchNewsById(id).then((data) => {
      setNewsData(data);
    });
  }, []);
  return (
    <div className="container">
      <div className="news-paper">
        <h2 className="news-paper__title">{newsData.title}</h2>
        <div className="news-paper__content">
          <NewsPaperContent img={process.env.REACT_APP_API_URL + newsData.img} />
          <Comments />
        </div>
        <div className="news-paper__info">
          <Description title="Описание" descr={newsData.description} />
        </div>
        <div className="news-paper__bottom">
          <AmountComponent img={like} value={newsData.amount_likes} />
          <AmountComponent img={view} value={newsData.amount_views} />
        </div>
      </div>
    </div>
  );
}

export default NewsPaper;
