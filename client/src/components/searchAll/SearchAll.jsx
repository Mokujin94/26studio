import React, { useContext, useRef, useState } from "react";

import style from "./searchAll.module.scss";
import "./animate.scss";
import { Context } from "../..";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router-dom";
import {
  GROUPS_ROUTE,
  PROFILE_ROUTE,
  PROJECTS_ROUTE,
} from "../../utils/consts";
import { CSSTransition, SwitchTransition } from "react-transition-group";

function SearchAll({ nodeRef, search, searchData, isLoading }) {
  const [isUserList, setIsUserList] = useState(false);
  const [isProjectList, setIsProjectList] = useState(false);
  const [isGroupList, setIsGroupList] = useState(false);

  const userListRef = useRef(null);
  const projectListRef = useRef(null);

  const usersBox = !isLoading &&
    searchData.users &&
    searchData.users.length > 0 && (
      <div className={style.search__content}>
        <div
          className={style.search__content__box}
          onClick={() => setIsUserList((isUserList) => !isUserList)}
        >
          <div className={style.search__content__box__info}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="15"
              viewBox="0 0 22 15"
              fill="none"
            >
              <path
                d="M10.9955 6.55032C12.633 6.55055 13.9682 5.23762 13.9955 3.60032V2.48032C13.9956 1.8156 13.7288 1.17866 13.255 0.712403C12.7812 0.246146 12.1401 -0.0103984 11.4755 0.000323034H10.5255C9.15971 0.00583017 8.05546 1.11455 8.05547 2.48032V3.60032C8.08206 5.21455 9.38135 6.51825 10.9955 6.55032Z"
                fill="#97BCE6"
              />
              <path
                d="M21.5955 11.7103L21.4755 10.2003C21.3458 9.442 20.6947 8.88335 19.9255 8.87032H15.6055C15.5392 8.86001 15.4717 8.86001 15.4055 8.87032C15.0222 8.43984 14.4718 8.19564 13.8955 8.20032H8.10547C7.49511 8.19766 6.91694 8.47385 6.53547 8.95032C6.37208 8.89058 6.19944 8.86012 6.02547 8.86032H1.70547C0.933055 8.87422 0.280881 9.43803 0.155468 10.2003L0.0354682 11.7603C-0.0650242 12.2387 0.0504501 12.7371 0.351099 13.1225C0.651748 13.508 1.107 13.7413 1.59547 13.7603H6.14547C6.23517 13.7707 6.32577 13.7707 6.41547 13.7603C6.81209 14.1981 7.37475 14.4486 7.96547 14.4503H14.0355C14.6082 14.4476 15.1545 14.2088 15.5455 13.7903H20.0355C20.5417 13.7763 21.0138 13.5321 21.3176 13.127C21.6215 12.7218 21.7238 12.2002 21.5955 11.7103Z"
                fill="#97BCE6"
              />
              <path
                d="M17.8155 7.31032C19.0305 7.31032 20.0155 6.32535 20.0155 5.11032V4.26032C20.0157 3.76089 19.8139 3.28259 19.4561 2.93418C19.0982 2.58576 18.6147 2.39682 18.1155 2.41032H17.4155C16.3937 2.41032 15.5655 3.2386 15.5655 4.26032V5.11032C15.5653 5.70257 15.804 6.26986 16.2274 6.68391C16.6509 7.09795 17.2234 7.32378 17.8155 7.31032Z"
                fill="#97BCE6"
              />
              <path
                d="M3.86547 7.31032C5.0805 7.31032 6.06547 6.32535 6.06547 5.11032V4.26032C6.06547 3.2386 5.2372 2.41032 4.21547 2.41032H3.51547C2.49374 2.41032 1.66547 3.2386 1.66547 4.26032V5.11032C1.66547 6.32535 2.65044 7.31032 3.86547 7.31032Z"
                fill="#97BCE6"
              />
            </svg>
            <h2 className={style.search__content__box__info__title}>
              Пользователи ({searchData.users.length})
            </h2>
          </div>
          <div
            className={
              isUserList
                ? style.search__content__arrow +
                  " " +
                  style.search__content__arrow_active
                : style.search__content__arrow
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="10"
              viewBox="0 0 17 10"
              fill="none"
            >
              <path
                d="M1.5 1.5L7.26263 7.93043C7.94318 8.68986 9.05682 8.68986 9.73737 7.93043L15.5 1.5"
                stroke="#97BCE6"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        {isUserList && (
          <ul className={style.search__content__list}>
            {searchData.users.map((item) => {
              return (
                <li>
                  <Link
                    to={PROFILE_ROUTE + "/" + item.id}
                    className={style.search__content__list__item}
                  >
                    <div className={style.search__content__list__item__info}>
                      <div className={style.search__user}>
                        <img
                          src={
                            process.env.REACT_APP_API_URL + "/" + item.avatar
                          }
                          alt=""
                          className={style.search__user__img}
                        />
                      </div>
                      <h2 className={style.search__user__name}>{item.name}</h2>
                    </div>
                    <div className={style.search__content__list__item__info}>
                      <h2 className={style.search__user__group}>
                        {item.group.name}
                      </h2>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );

  const projectsBox =
    !isLoading && searchData.projects && searchData.projects.length > 0 ? (
      <div className={style.search__content}>
        <div
          className={style.search__content__box}
          onClick={() => setIsProjectList((isProjectList) => !isProjectList)}
        >
          <div className={style.search__content__box__info}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
            >
              <path
                d="M9.125 22.1864H8.5C3.5 22.1864 1 20.9402 1 14.7089V8.47757C1 3.49252 3.5 1 8.5 1H18.5C23.5 1 26 3.49252 26 8.47757V14.7089C26 19.6939 23.5 22.1864 18.5 22.1864H17.875C17.4875 22.1864 17.1125 22.3734 16.875 22.6849L15 25.1775C14.175 26.2742 12.825 26.2742 12 25.1775L10.125 22.6849C9.925 22.4108 9.475 22.1864 9.125 22.1864Z"
                fill="#FCFCFC"
                stroke="#27323E"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.5 9.38783L6 11.8804L8.5 14.3729M18.5 9.38783L21 11.8804L18.5 14.3729M14.75 8.97656L12.25 14.7841L14.75 8.97656Z"
                fill="#FCFCFC"
              />
              <path
                d="M8.5 9.38783L6 11.8804L8.5 14.3729M18.5 9.38783L21 11.8804L18.5 14.3729M14.75 8.97656L12.25 14.7841"
                stroke="#27323E"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 className={style.search__content__box__info__title}>
              Проекты ({searchData.projects.length})
            </h2>
          </div>
          <div
            className={
              isProjectList
                ? style.search__content__arrow +
                  " " +
                  style.search__content__arrow_active
                : style.search__content__arrow
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="10"
              viewBox="0 0 17 10"
              fill="none"
            >
              <path
                d="M1.5 1.5L7.26263 7.93043C7.94318 8.68986 9.05682 8.68986 9.73737 7.93043L15.5 1.5"
                stroke="#97BCE6"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        {isProjectList && (
          <ul className={style.search__content__list}>
            {searchData.projects.map((item) => {
              return (
                <li>
                  <Link
                    to={PROJECTS_ROUTE + "/" + item.id}
                    className={style.search__content__list__item}
                  >
                    <div className={style.search__content__list__item__info}>
                      <div
                        className={
                          style.search__user + " " + style.search__user_project
                        }
                      >
                        <img
                          src={
                            process.env.REACT_APP_API_URL + "/" + item.preview
                          }
                          alt=""
                          className={style.search__user__img}
                        />
                      </div>
                      <h2 className={style.search__user__name}>{item.name}</h2>
                    </div>
                    <div
                      className={style.search__content__list__item__info}
                    ></div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    ) : null;

  const groupsBox =
    !isLoading && searchData.groups && searchData.groups.length > 0 ? (
      <div className={style.search__content}>
        <div
          className={style.search__content__box}
          onClick={() => setIsGroupList((isGroupList) => !isGroupList)}
        >
          <div className={style.search__content__box__info}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
            >
              <path
                d="M21.0319 7.44919C20.9531 7.43669 20.8728 7.43669 20.794 7.44919C19.9583 7.41903 19.1672 7.06575 18.5877 6.46402C18.0082 5.86229 17.6858 5.05924 17.6886 4.2246C17.6886 2.43732 19.1286 1 20.9192 1C21.7761 1 22.5978 1.33973 23.2036 1.94446C23.8095 2.54919 24.1499 3.36938 24.1499 4.2246C24.1476 5.05984 23.8218 5.86184 23.2407 6.46283C22.6596 7.06383 21.8681 7.41726 21.0319 7.44919ZM19.7422 16.5481C21.4577 16.8355 23.3485 16.5356 24.6758 15.6482C26.4414 14.4733 26.4414 12.5486 24.6758 11.3737C23.336 10.4863 21.4201 10.1864 19.7046 10.4863M5.96807 7.44919C6.0432 7.4367 6.13085 7.4367 6.20599 7.44919C7.04166 7.41903 7.83284 7.06575 8.41234 6.46402C8.99184 5.86229 9.31424 5.05924 9.31142 4.2246C9.31142 2.43732 7.8714 1 6.08077 1C5.22394 1 4.40221 1.33973 3.79635 1.94446C3.19048 2.54919 2.85011 3.36938 2.85011 4.2246C2.86263 5.97438 4.24004 7.3867 5.96807 7.44919ZM7.25783 16.5481C5.54232 16.8355 3.65152 16.5356 2.32419 15.6482C0.558603 14.4733 0.558603 12.5486 2.32419 11.3737C3.66404 10.4863 5.57989 10.1864 7.29539 10.4863M13.5188 16.7855C13.44 16.773 13.3597 16.773 13.2809 16.7855C12.4452 16.7554 11.654 16.4021 11.0745 15.8004C10.495 15.1986 10.1726 14.3956 10.1754 13.5609C10.1754 11.7737 11.6155 10.3363 13.4061 10.3363C14.2629 10.3363 15.0846 10.6761 15.6905 11.2808C16.2964 11.8855 16.6367 12.7057 16.6367 13.5609C16.6242 15.3107 15.2468 16.7355 13.5188 16.7855ZM9.87491 20.7225C8.10932 21.8974 8.10932 23.8221 9.87491 24.997C11.8784 26.3343 15.1592 26.3343 17.1627 24.997C18.9282 23.8221 18.9282 21.8974 17.1627 20.7225C15.1717 19.3977 11.8784 19.3977 9.87491 20.7225Z"
                fill="#FCFCFC"
              />
              <path
                d="M19.7422 16.5481C21.4577 16.8355 23.3485 16.5356 24.6758 15.6482C26.4414 14.4733 26.4414 12.5486 24.6758 11.3737C23.336 10.4863 21.4201 10.1864 19.7046 10.4863M7.25783 16.5481C5.54232 16.8355 3.65152 16.5356 2.32419 15.6482C0.558603 14.4733 0.558603 12.5486 2.32419 11.3737C3.66404 10.4863 5.57989 10.1864 7.29539 10.4863M21.0319 7.44919C20.9531 7.43669 20.8728 7.43669 20.794 7.44919C19.9583 7.41903 19.1672 7.06575 18.5877 6.46402C18.0082 5.86229 17.6858 5.05924 17.6886 4.2246C17.6886 2.43732 19.1286 1 20.9192 1C21.7761 1 22.5978 1.33973 23.2036 1.94446C23.8095 2.54919 24.1499 3.36938 24.1499 4.2246C24.1476 5.05984 23.8218 5.86184 23.2407 6.46283C22.6596 7.06383 21.8681 7.41726 21.0319 7.44919ZM5.96807 7.44919C6.0432 7.43669 6.13085 7.43669 6.20599 7.44919C7.04166 7.41903 7.83284 7.06575 8.41234 6.46402C8.99184 5.86229 9.31424 5.05924 9.31142 4.2246C9.31142 2.43732 7.8714 1 6.08077 1C5.22394 1 4.40221 1.33973 3.79635 1.94446C3.19048 2.54919 2.85011 3.36938 2.85011 4.2246C2.86263 5.97438 4.24004 7.3867 5.96807 7.44919ZM13.5188 16.7855C13.44 16.773 13.3597 16.773 13.2809 16.7855C12.4452 16.7554 11.654 16.4021 11.0745 15.8004C10.495 15.1986 10.1726 14.3956 10.1754 13.5609C10.1754 11.7737 11.6155 10.3363 13.4061 10.3363C14.2629 10.3363 15.0846 10.6761 15.6905 11.2808C16.2964 11.8855 16.6367 12.7057 16.6367 13.5609C16.6242 15.3107 15.2468 16.7355 13.5188 16.7855ZM9.87491 20.7225C8.10932 21.8974 8.10932 23.8221 9.87491 24.997C11.8784 26.3343 15.1592 26.3343 17.1627 24.997C18.9282 23.8221 18.9282 21.8974 17.1627 20.7225C15.1717 19.3977 11.8784 19.3977 9.87491 20.7225Z"
                stroke="#27323E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 className={style.search__content__box__info__title}>
              Группы ({searchData.groups.length})
            </h2>
          </div>
          <div
            className={
              isGroupList
                ? style.search__content__arrow +
                  " " +
                  style.search__content__arrow_active
                : style.search__content__arrow
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="10"
              viewBox="0 0 17 10"
              fill="none"
            >
              <path
                d="M1.5 1.5L7.26263 7.93043C7.94318 8.68986 9.05682 8.68986 9.73737 7.93043L15.5 1.5"
                stroke="#97BCE6"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        {isGroupList && (
          <ul className={style.search__content__list}>
            {searchData.groups.map((item) => {
              return (
                <li>
                  <Link
                    to={GROUPS_ROUTE + "/" + item.id}
                    className={style.search__content__list__item}
                  >
                    <div className={style.search__content__list__item__info}>
                      {/* <div className={style.search__user}>
                        <img
                          src={
                            process.env.REACT_APP_API_URL + "/" + item.preview
                          }
                          alt=""
                          className={style.search__user__img}
                        />
                      </div> */}
                      <h2 className={style.search__user__name}>{item.name}</h2>
                    </div>
                    <div className={style.search__content__list__item__info}>
                      <h2 className={style.search__user__group}>
                        {item.members.length}
                      </h2>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    ) : null;
  return (
    <div className={style.search}>
      {isLoading && (
        <div className={style.center}>
          <Spinner />
        </div>
      )}
      {usersBox}
      {projectsBox}
      {groupsBox}
      {searchData &&
      searchData.projects &&
      searchData.users &&
      searchData.groups &&
      searchData.projects.length == 0 &&
      searchData.users.length == 0 &&
      searchData.groups.length == 0 &&
      !isLoading ? (
        <div className={style.center}>
          <h2 className={style.notFound}>Не найдено</h2>
        </div>
      ) : null}
    </div>
  );
}

export default SearchAll;
