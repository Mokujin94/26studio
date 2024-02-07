import React, { useContext, useEffect, useState } from "react";
import style from "./friendCard.module.scss";

import message from "../../resource/graphics/icons/friendCard/message.svg";
import deleteFriend from "../../resource/graphics/icons/friendCard/delete.svg";
import { Context } from "../..";
import { fetchGroups } from "../../http/groupsAPI";
import { observer } from "mobx-react-lite";
import { fetchOneUser } from "../../http/userAPI";

const FriendCard = ({ userId, status, options, onClickOne, onClickTwo }) => {
  const [user, setUser] = useState({});
  const [group, setGroup] = useState();

  useEffect(() => {
    fetchOneUser(userId)
      .then((data) => {
        setUser(data);
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
        <h2 className={style.friendCard__infoNickName}>
          {user.name}
        </h2>
        <h2 className={style.friendCard__infoFullname}>
          {user.full_name}
        </h2>
        <h2 className={style.friendCard__info__online}>был в сети: 4ч назад</h2>
      </div>
      {
        !status && 
          <div className={style.friendCard__buttons}>
            <div
              className={style.friendCard__buttons__item}
              onClick={onClickTwo}
            >
              <svg
                className={style.friendCard__buttons__item__icon}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <circle cx="12.5" cy="12.5" r="12" stroke="white" />
                <path
                  d="M7.69427 5L5 7.69427L6.3758 9.07006L9.77707 12.5287L6.3758 15.9299L5 17.2484L7.69427 20L9.07006 18.6242L12.5287 15.1656L15.9299 18.6242L17.2484 20L20 17.2484L18.6242 15.9299L15.1656 12.5287L18.6242 9.07006L20 7.69427L17.2484 5L15.9299 6.3758L12.5287 9.77707L9.07006 6.3758L7.69427 5Z"
                  fill="#FCFCFC"
                />
              </svg>
            </div>
            <div
              className={style.friendCard__buttons__item}
              onClick={onClickOne}
            >
              <svg
                className={style.friendCard__buttons__item__icon}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <circle cx="12.5" cy="12.5" r="12" stroke="white" />
                <path
                  d="M17.2484 7L15.9299 8.13386L10.6178 12.5118L9.07006 11.2835L7.69427 10.1496L5 12.3701L6.3758 13.5039L9.24204 15.8661L10.5605 17L11.9363 15.8661L18.6242 10.3543L20 9.22047L17.2484 7Z"
                  fill="#FCFCFC"
                />
              </svg>
            </div>
          </div>
      }
      {
        options &&
          <div className={style.friendCard__buttons}>
        {options === 1 ? (
          <>
            <div
              className={style.friendCard__buttons__item}
              onClick={onClickTwo}
            >
              <svg
                className={style.friendCard__buttons__item__icon}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <circle cx="12.5" cy="12.5" r="12" stroke="white" />
                <path
                  d="M7.69427 5L5 7.69427L6.3758 9.07006L9.77707 12.5287L6.3758 15.9299L5 17.2484L7.69427 20L9.07006 18.6242L12.5287 15.1656L15.9299 18.6242L17.2484 20L20 17.2484L18.6242 15.9299L15.1656 12.5287L18.6242 9.07006L20 7.69427L17.2484 5L15.9299 6.3758L12.5287 9.77707L9.07006 6.3758L7.69427 5Z"
                  fill="#FCFCFC"
                />
              </svg>
            </div>
          </>
        ) : options === 2 && (
          <>
            <div
              className={style.friendCard__buttons__item}
              onClick={onClickTwo}
            >
              <svg
                className={style.friendCard__buttons__item__icon}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <circle cx="12.5" cy="12.5" r="12" stroke="white" />
                <path
                  d="M7.69427 5L5 7.69427L6.3758 9.07006L9.77707 12.5287L6.3758 15.9299L5 17.2484L7.69427 20L9.07006 18.6242L12.5287 15.1656L15.9299 18.6242L17.2484 20L20 17.2484L18.6242 15.9299L15.1656 12.5287L18.6242 9.07006L20 7.69427L17.2484 5L15.9299 6.3758L12.5287 9.77707L9.07006 6.3758L7.69427 5Z"
                  fill="#FCFCFC"
                />
              </svg>
            </div>
            <div
              className={style.friendCard__buttons__item}
              onClick={onClickOne}
            >
              <svg
                className={style.friendCard__buttons__item__icon}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <circle cx="12.5" cy="12.5" r="12" stroke="white" />
                <path
                  d="M17.2484 7L15.9299 8.13386L10.6178 12.5118L9.07006 11.2835L7.69427 10.1496L5 12.3701L6.3758 13.5039L9.24204 15.8661L10.5605 17L11.9363 15.8661L18.6242 10.3543L20 9.22047L17.2484 7Z"
                  fill="#FCFCFC"
                />
              </svg>
            </div>
          </>
        )}
      </div>
      }
      
    </div>
  );
};

export default FriendCard;
