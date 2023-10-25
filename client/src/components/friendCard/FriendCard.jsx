import React, { useContext, useEffect, useState } from "react";
import style from "./friendCard.module.scss";

import message from "../../resource/graphics/icons/friendCard/message.svg";
import deleteFriend from "../../resource/graphics/icons/friendCard/delete.svg";
import { Context } from "../..";
import { fetchGroups } from "../../http/groupsAPI";
import { observer } from "mobx-react-lite";
import { fetchOneUser } from "../../http/userAPI";

const FriendCard = ({ userId }) => {
  const [user, setUser] = useState({});
  const [group, setGroup] = useState();

  useEffect(() => {
    fetchOneUser(userId)
      .then((data) => {
        setUser(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className={style.friendCard}>
      <div className={style.friendCard__avatar}>
        <img
          src={process.env.REACT_APP_API_URL + user.avatar}
          alt="img"
          className={style.friendCard__avatar__img}
        />
      </div>
      <div className={style.friendCard__info}>
        <div className={style.friendCard__info__nick}>
          <h2 className={style.friendCard__info__nick__nickName}>
            {user.name}
          </h2>
          <div className={style.friendCard__info__nick__achievement}></div>
        </div>
        <div className={style.friendCard__info__name}>
          <h2 className={style.friendCard__info__name__fullname}>
            {user.full_name}
          </h2>
          {/* <h2 className={style.friendCard__info__name__group}>{group}</h2> */}
        </div>
        <h2 className={style.friendCard__info__online}>был в сети: 4ч назад</h2>
      </div>
      <div className={style.friendCard__buttons}>
        <div className={style.friendCard__buttons__item}>
          <img
            src={message}
            alt="img"
            className={style.friendCard__buttons__item__icon}
          />
        </div>
        <div className={style.friendCard__buttons__item}>
          <img
            src={deleteFriend}
            alt="img"
            className={style.friendCard__buttons__item__icon}
          />
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
