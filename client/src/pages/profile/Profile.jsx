import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CSSTransition,
  SwitchTransition,
  Transition,
  TransitionGroup,
} from "react-transition-group";

import FunctionButton from "../../components/functionButton/FunctionButton";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";

import vk from "../../resource/graphics/icons/profile/vk.svg";
import tg from "../../resource/graphics/icons/profile/tg.svg";
import git from "../../resource/graphics/icons/profile/git.svg";
import notification from "../../resource/audio/notification.mp3";
import achievement from "../../resource/graphics/icons/profile/achievement.svg";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { fetchUserById, updateAvatar } from "../../http/userAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PROFILE_ROUTE } from "../../utils/consts";
import {
  addFriend,
  deleteFriend,
  getFriends,
  reqFriend,
} from "../../http/friendAPI";
import { useClickOutside } from "../../hooks/useClickOutside";
import ImageCropper from "../../components/imageCropper/ImageCropper";
import ProfileFriends from "../../components/profileFriends/ProfileFriends";

const Profile = observer(() => {
  const { profile, user, modal } = useContext(Context);
  const [group, setGroup] = useState("");
  const [userId, setUserId] = useState({});
  const [textButton, setTextButton] = useState("");
  const location = useLocation();
  const { id } = useParams();
  const [prevId, setPrevId] = useState(0);
  const [boolPrevId, setBoolPrevId] = useState(false);
  const nav = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarReader, setAvatarReader] = useState(null);
  const [offsetMenuLineActive, setOffsetMenuLineActive] = useState(
    100 / profile.menuItemsOtherUser.length
  );
  const [statusFriend, setStatusFriend] = useState(true)

  const miniatureRef = useRef(null);

  useClickOutside(miniatureRef, () => {
    setAvatarFile(null);
    user.setModalProfileMiniature(false);
    setTimeout(() => {
      setAvatarReader(null);
    }, 300);
  });

  useEffect(() => {
    profile.setSelectedMenu({ id: 0, title: "Проекты" });
    setStatusFriend(true)
    fetchUserById(id)
      .then((dataUser) => {
        setUserId(dataUser);
        setGroup(dataUser.group.name);
      })
      .catch((err) => {
        nav(PROFILE_ROUTE + "/" + user.user.id);
      });

    if (Number(id) === user.user.id) {
      setTextButton("Редактировать");
    } else {
      getFriends(Number(id)).then((data) => {
        console.log(data.length);
        if (data.length) {
          data.filter((item) => {
            if (item.id_sender === user.user.id && !item.status) {
              return setTextButton("Отменить заявку");
            }
            if (item.id_recipient === user.user.id && !item.status) {
              return setTextButton("Принять заявку");
            }
            if (
              item.id_recipient === user.user.id ||
              (item.id_sender === user.user.id && item.status)
            ) {
              return setTextButton("Удалить из друзей");
            }
            return setTextButton("Добавить в друзья");
          });
        } else {
          return setTextButton("Добавить в друзья");
        }
      });
    }
  }, [location.pathname, user.user.id]);

  useEffect(() => {
    const root = document.querySelector(":root");

    root.style.setProperty("--menu-width-line", offsetMenuLineActive + "%");
    root.style.setProperty(
      "--menu-active-line",
      `${offsetMenuLineActive * profile.selectedMenu.id}%`
    );

    if (user.user.id && Number(id) === user.user.id) {
      setOffsetMenuLineActive(100 / profile.menuItems.length);
      root.style.setProperty("--menu-width-line", offsetMenuLineActive + "%");
    } else {
      setOffsetMenuLineActive(100 / profile.menuItemsOtherUser.length);
    }
  }, [location.pathname, user.user.id, offsetMenuLineActive]);

  const checkPrevId = (item) => {
    profile.setSelectedMenu(item);
    if (prevId > profile.selectedMenu.id) {
      setBoolPrevId(false);
      setPrevId(profile.selectedMenu.id);
    } else if (prevId < profile.selectedMenu.id) {
      setBoolPrevId(true);
      setPrevId(profile.selectedMenu.id);
    }
  };

  const onButton = () => {
    if (textButton === "Редактировать") {
      console.log("Редактировать");
      new Audio(notification).play();
    } else if (textButton === "Добавить в друзья") {
      return reqFriend(user.user.id, id)
        .then(() => {
          modal.setModalComplete(true);
          modal.setModalCompleteMessage("Заявка отправлена");
          setTextButton("Отменить заявку");
        })
        .catch((err) => {
          console.log(err);
          modal.setModalComplete(true);
          modal.setModalCompleteMessage(
            `${userId.name} уже хочет быть вашим другом`
          );
          setTextButton("Принять заявку");
        });
    } else if (textButton === "Отменить заявку") {
      return deleteFriend(user.user.id, id)
        .then(() => {
          modal.setModalComplete(true);
          modal.setModalCompleteMessage("Заявка отменена");
          setTextButton("Добавить в друзья");
        })
        .catch((e) => console.log(e));
    } else if (textButton === "Принять заявку") {
      return addFriend(id, user.user.id)
        .then(() => {
          modal.setModalComplete(true);
          modal.setModalCompleteMessage(
            userId.name + " теперь у вас в друзьях!"
          );
          setTextButton("Удалить из друзей");
        })
        .catch((e) => {
          modal.setModalComplete(true);
          modal.setModalCompleteMessage(e.response.data.message);
          setTextButton("Добавить в друзья");
        })
        .catch((e) => console.log(e));
    } else if (textButton === "Удалить из друзей") {
      return deleteFriend(user.user.id, id)
        .then(() => {
          modal.setModalComplete(true);
          modal.setModalCompleteMessage(
            `Пользователь ${userId.name} удалён из друзей`
          );
          setTextButton("Добавить в друзья");
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    const root = document.querySelector(":root");
    if (!boolPrevId) {
      root.style.setProperty("--transform", "2000px");
    } else {
      root.style.setProperty("--transform", "-2000px");
    }
    root.style.setProperty(
      "--menu-active-line",
      `${offsetMenuLineActive * profile.selectedMenu.id}%`
    );
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [boolPrevId, prevId, offsetMenuLineActive, profile.selectedMenu.id]);

  const onSelectAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result;
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < 150 || naturalHeight < 150) {
          modal.setModalErrorMessage(
            "Минимальный размер изображения: 150 x 150"
          );

          modal.setModalError(true);
          console.log(modal.modalError);
          setAvatarReader("");
          return;
        }
        user.setModalProfileMiniature(true);
      });
      setAvatarReader(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile">
      <div className="container">
        <div className="profile__top-content">
          <CSSTransition
            in={user.modalProfileMiniature}
            timeout={300}
            classNames="create-anim"
            unmountOnExit
          >
            <div className="profile__miniature-modal">
              <div
                className="profile__miniature-modal-content"
                ref={miniatureRef}
              >
                <div className="profile__miniature-modal-img">
                  <ImageCropper
                    imageSrc={avatarReader}
                    setImageSrc={setAvatarReader}
                    setAvatarFile={setAvatarFile}
                  />
                </div>
              </div>
            </div>
          </CSSTransition>
          <div className="profile__top-content-wrapper">
            <div className="profile__face">
              <div className="profile__avatar">
                {Number(id) === user.user.id ? (
                  <label htmlFor="avatar" className="profile__avatar-inner">
                    <img
                      className="profile__avatar-img"
                      src={
                        id == user.user.id
                          ? process.env.REACT_APP_API_URL + user.user.avatar
                          : process.env.REACT_APP_API_URL + userId.avatar
                      }
                      alt="icon"
                    />
                    <input
                      className="profile__avatar-input"
                      onClick={(e) => {
                        e.target.value = "";
                      }}
                      onChange={onSelectAvatarFile}
                      type="file"
                      name="avatar"
                      id="avatar"
                      accept="image/png, image/jpeg"
                    />
                  </label>
                ) : (
                  <img
                    className="profile__avatar-img"
                    src={
                      id == user.user.id
                        ? process.env.REACT_APP_API_URL + user.user.avatar
                        : process.env.REACT_APP_API_URL + userId.avatar
                    }
                    alt="icon"
                  />
                )}
              </div>

              <div className="profile__button">
                <FunctionButton onClick={onButton}>{textButton}</FunctionButton>
              </div>

              <div className="profile__socials">
                <div className="profile__socials-icon">
                  <img
                    className="profile__socials-icon-img"
                    src={git}
                    alt="icon"
                  />
                </div>
                <div className="profile__socials-icon">
                  <img
                    className="profile__socials-icon-img"
                    src={tg}
                    alt="icon"
                  />
                </div>
                <div className="profile__socials-icon">
                  <img
                    className="profile__socials-icon-img"
                    src={vk}
                    alt="icon"
                  />
                </div>
              </div>
            </div>

            <div className="profile__info">
              <div className="profile__name">
                <div className="profile__nickname">
                  {id == user.user.id ? user.user.name : userId.name}
                </div>
                {/* <img
                  className="profile__achievement"
                  src={achievement}
                  alt=""
                /> */}
              </div>
              <div className="profile__more-info">
                <div className="profile__full-name">
                  {id == user.user.id ? user.user.full_name : userId.full_name}
                </div>
                <div className="profile__group">{group}</div>
              </div>
              <div className="profile__description">
                {id == user.user.id
                  ? user.user.description
                  : userId.description}
              </div>
            </div>
          </div>
          <div className="profile__top-content-friends">
              {
                user.user.id == id
                  ? 
                  <ul className="profile__top-content-friends-menu">
                    <li className={statusFriend ? "profile__top-content-friends-menu-item profile__top-content-friends-menu-item_active" : "profile__top-content-friends-menu-item"}
                      onClick={() => {setStatusFriend(true)}}
                    >
                      Друзья
                    </li>
                    <li className={!statusFriend ? "profile__top-content-friends-menu-item profile__top-content-friends-menu-item_active" : "profile__top-content-friends-menu-item"}
                      onClick={() => {setStatusFriend(false)}}
                    >
                      Заявки
                    </li>
                  </ul>
                  :
                  <ul className="profile__top-content-friends-menu">
                    <li className={"profile__top-content-friends-menu-item profile__top-content-friends-menu-item_other"}
                    >
                      Друзья
                    </li>
                  </ul>
              }
              
            {
              user.user.id == id
                ? 
                <div className="profile__top-content-friends-inner">
                  <SwitchTransition mode="out-in">
                    <CSSTransition
                      key={statusFriend}
                      classNames="create-anim"
                    >
                        <ProfileFriends status={statusFriend} />
                    </CSSTransition>
                  </SwitchTransition>
                </div>
                :
                <div className="profile__top-content-friends-inner">
                  <ProfileFriends status={true}/>
                </div>
            }
            
          </div>
        </div>
        <div className="profile__content">
          {
            user.user.id == id
              &&
              <div className="profile__menu-wrapper">
                <ProfileMenu id={id} onClick={checkPrevId} />
              </div>
          }
          
          <TransitionGroup className="transition-group">
            {profile.wrapperItems.map((item) => {
              if (profile.selectedMenu.id === item.id) {
                return (
                  <CSSTransition
                    key={item.id}
                    nodeRef={item.nodeRef}
                    timeout={500}
                    classNames={boolPrevId ? `itemLeft` : `itemRight`}
                  >
                    <div
                      className={
                        profile.selectedMenu.id === 3
                          ? "profile__content-main profile__content-main-settings"
                          : profile.selectedMenu.id === 2
                          ? "profile__content-main profile__content-main-achievement"
                          : "profile__content-main"
                      }
                      ref={item.nodeRef}
                    >
                      {item.element}
                    </div>
                  </CSSTransition>
                );
              }
            })}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
});

export default Profile;
