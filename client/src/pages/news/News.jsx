import React, { useContext, useEffect, useState } from 'react';
import NewsCard from '../../components/newsCard/NewsCard';
import { Context } from '../../index';
import { NEWSPAPER_ROUTE } from '../../utils/consts';

import './news.scss';

import { Link } from 'react-router-dom';
import NewsSkeleton from '../../components/newsSkeleton/NewsSkeleton';
import { fetchNews } from '../../http/newsAPI';
import { observer } from 'mobx-react-lite';

const News = observer(() => {
  const { news } = useContext(Context);
  const [isLoaded, setIsLoaded] = useState(true);
  const [newsCollection, setNewsCollection] = useState();
  useEffect(() => {
    fetchNews()
      .then((data) => {
        news.setNews(data.rows);
        setNewsCollection(
          news.news.map((item) => (
            <Link key={item.id} to={NEWSPAPER_ROUTE + '/' + item.id}>
              <NewsCard news={item} />
            </Link>
          ))
        );
        setIsLoaded(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const skeletonList = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }];

  const newSkeletonList = skeletonList.map(({ id }) => <NewsSkeleton key={id} />);

  return (
    <div className="container">
      <div className="news">
        <div className="news__title-wrapper">
          <h1 className="news__title">Популярные новости</h1>
        </div>
        <div className="news__cards">{isLoaded ? newSkeletonList : newsCollection}</div>
      </div>
    </div>
  );
});

export default News;
