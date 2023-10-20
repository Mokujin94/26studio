import React from "react";
import Description from "../../components/description/Description";
import Comments from "../../components/comments/Comments";
import NewsPaperContent from "../../components/newsPaperContent/NewsPaperContent";
import NewsPaperHeader from "../../components/newsPaperHeader/NewsPaperHeader";
import AmountComponent from "../../components/amountComponent/AmountComponent";

import like from "../../resource/graphics/icons/newsCard/likes.svg";
import view from "../../resource/graphics/icons/newsCard/views.svg";
import com from "../../resource/graphics/icons/newsCard/comments.svg";

import "./newsPaper.scss";

function NewsPaper() {
  return (
    <div className="container">
      <div className="news-paper">
        <div className="news-paper__header">
          <NewsPaperHeader title="Новость" autor="dejavu98" date="03.04.23" />
        </div>
        <div className="news-paper__content">
          <NewsPaperContent />
          <Comments />
        </div>
        <div className="news-paper__info">
          <Description
            title="Описание"
            descr='Давно выяснено, что при оценке дизайна и композиции читаемый текст
        мешает сосредоточиться. Lorem Ipsum используют потому, что тот
        обеспечивает более или менее стандартное заполнение шаблона, а также
        реальное распределение букв и пробелов в абзацах, которое не получается
        при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш
        текст.." Многие программы электронной вёрстки и редакторы HTML
        используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по
        ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц
        всё ещё дожидаются своего настоящего рождения. За прошедшие годы текст
        Lorem Ipsum получил много версий. Некоторые версии появились по ошибке,
        некоторые - намеренно (например, юмористические варианты).'
          />
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
