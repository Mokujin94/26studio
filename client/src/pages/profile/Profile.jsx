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
    friendAccept,
    friendDelete,
    friendRequest,
} from "../../http/friendAPI";
import { useClickOutside } from "../../hooks/useClickOutside";
import ImageCropper from "../../components/imageCropper/ImageCropper";
import ProfileFriends from "../../components/profileFriends/ProfileFriends";
import FriendCard from "../../components/friendCard/FriendCard";
import ProfileMainSkeleton from "../../components/Skeletons/ProfileMainSkeleton";
import ProfileFriendsSkeleton from "../../components/Skeletons/ProfileFriendsSkeleton";

const Profile = observer(() => {
    const { profile, user, modal } = useContext(Context);
    const [group, setGroup] = useState("");
    const [descr, setDescr] = useState("");
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

    const [friendsRequest, setFriendsRequest] = useState([]);
    const [friends, setFriends] = useState([]);
    const [statusFriend, setStatusFriend] = useState(false);

    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    const miniatureRef = useRef(null);

    useClickOutside(miniatureRef, () => {
        setAvatarFile(null);
        user.setModalProfileMiniature(false);
        setTimeout(() => {
            setAvatarReader(null);
        }, 300);
    });

    useEffect(() => {
        setIsLoadingProfile(true);
        setFriendsRequest([]);
        setFriends([]);
        profile.setSelectedMenu({ id: 0, title: "Проекты" });
        setStatusFriend(true);
        fetchUserById(Number(id))
            .then((dataUser) => {
                document.title = `${dataUser.name}`
                setUserId(dataUser);
                if (dataUser.group_status) {
                    setGroup(dataUser.group.name);
                } else {
                    setGroup(`${dataUser.group.name} (Группа не подтверджена)`);
                }


                if (dataUser.description) {
                    setDescr(dataUser.description);
                } else {
                    if (dataUser.id !== user.user.id) {
                        setDescr("Нет описания");
                    } else {
                        setDescr("Расскажите о себе");
                    }
                }

                if (dataUser.friends.length) {
                    const friendsAll = dataUser.friends
                        .filter((item) => item.status)
                        .map((item) => (
                            <FriendCard
                                userId={
                                    item.friendId === dataUser.id ? item.userId : item.friendId
                                }
                                key={item.id}
                            />
                        ));

                    const requestsAll = dataUser.friends
                        .filter((item) => !item.status && item.userId !== user.user.id)
                        .map((item) => (
                            <FriendCard
                                userId={
                                    item.friendId === dataUser.id ? item.userId : item.friendId
                                }
                                key={item.id}
                            />
                        ));

                    setFriends(friendsAll);
                    setFriendsRequest(requestsAll);
                }
            })
            .then(() => setIsLoadingProfile(false))
            .catch((err) => {
                nav(PROFILE_ROUTE + "/" + user.user.id);
            });
    }, [id]);

    useEffect(() => {

        if (user.user.id) {
            if (userId.friends && userId.friends.length) {
                userId.friends.filter((item) => {
                    if (item.userId === user.user.id && item.friendId === userId.id || item.friendId === user.user.id && item.userId === userId.id) {
                        return item;
                    } else {
                        return setTextButton("Добавить в друзья");
                    }
                }).map(item => {
                    if (item.status) {
                        if (
                            item.userId === user.user.id ||
                            item.friendId === user.user.id
                        ) {
                            console.log("2");
                            return setTextButton("Удалить из друзей");
                        }
                    } else {
                        if (item.userId === user.user.id) {
                            console.log("3");
                            return setTextButton("Отменить заявку");
                        }
                        if (item.friendId === user.user.id) {
                            console.log("4");
                            return setTextButton("Принять заявку");
                        }
                    }
                })
            } else {
                setTextButton("Добавить в друзья");
            }
        } else {
            setTextButton("Добавить в друзья");
        }
    }, [user.user.id, id, userId]);

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

    const onClickFriend = () => {
        if (textButton === "Добавить в друзья") {
            return friendRequest(user.user.id, userId.id).then((data) => {
                modal.setModalComplete(true);
                modal.setModalCompleteMessage("Заявка отправлена");
                setTextButton("Отменить заявку");
            });
        }
        if (textButton === "Отменить заявку") {
            return friendDelete(user.user.id, userId.id).then((data) => {
                modal.setModalComplete(true);
                modal.setModalCompleteMessage("Заявка отменена");
                setTextButton("Добавить в друзья");
            });
        }
        if (textButton === "Принять заявку") {
            return friendAccept(userId.id, user.user.id).then((data) => {
                modal.setModalComplete(true);
                modal.setModalCompleteMessage(
                    `Пользователь ${userId.name} теперь у вас в друзьях`
                );
                setTextButton("Удалить из друзей");
            });
        }
        if (textButton === "Удалить из друзей") {
            return friendDelete(user.user.id, userId.id).then((data) => {
                modal.setModalComplete(true);
                modal.setModalCompleteMessage(`Пользователь ${userId.name} удален из друзей`);
                setTextButton("Добавить в друзья");
            });
        }
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
                    <div
                        className="profile__top-content-wrapper"
                        style={isLoadingProfile ? { padding: "0px" } : null}
                    >
                        {isLoadingProfile ? (
                            <ProfileMainSkeleton />
                        ) : (
                            <>
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

                                    {user.user.id == id ? (
                                        <div className="profile__button">
                                            <FunctionButton onClick={() => profile.setEditModal(true)}>Редактировать</FunctionButton>
                                        </div>
                                    ) : user.user.id ? (
                                        <div className="profile__button">
                                            <FunctionButton onClick={onClickFriend}>
                                                {textButton}
                                            </FunctionButton>
                                        </div>
                                    ) : (
                                        <div className="profile__button">
                                            <FunctionButton>Добавить в друзья</FunctionButton>
                                        </div>
                                    )}

                                    {/* <div className="profile__socials">
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
              </div> */}
                                </div>

                                <div className="profile__info">
                                    <div className="profile__name">
                                        <div className="profile__nickname">{userId.name}</div>
                                        {/* <img
                  className="profile__achievement"
                  src={achievement}
                  alt=""
                /> */}
                                    </div>
                                    <div className="profile__more-info">
                                        <div className="profile__full-name">{userId.full_name}</div>
                                        <div className="profile__group">{group}</div>
                                    </div>
                                    <div className="profile__description">
                                        {/* 520 символов максимум  */}
                                        {descr}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="profile__top-content-friends">
                        {user.user.id == id ? (
                            <ul className="profile__top-content-friends-menu">
                                <li
                                    className={
                                        statusFriend
                                            ? "profile__top-content-friends-menu-item profile__top-content-friends-menu-item_active"
                                            : "profile__top-content-friends-menu-item"
                                    }
                                    onClick={() => {
                                        setStatusFriend(true);
                                    }}
                                >
                                    Друзья
                                </li>
                                <li
                                    className={
                                        !statusFriend
                                            ? "profile__top-content-friends-menu-item profile__top-content-friends-menu-item_active"
                                            : "profile__top-content-friends-menu-item"
                                    }
                                    onClick={() => {
                                        setStatusFriend(false);
                                    }}
                                >
                                    Заявки
                                </li>
                            </ul>
                        ) : (
                            <ul className="profile__top-content-friends-menu">
                                <li
                                    className={
                                        "profile__top-content-friends-menu-item profile__top-content-friends-menu-item_other"
                                    }
                                >
                                    Друзья
                                </li>
                            </ul>
                        )}

                        <div className="profile__top-content-friends-inner">
                            {statusFriend && id == user.user.id && (
                                <input
                                    type="text"
                                    className="profile__top-content-friends-search"
                                    placeholder="Поиск друзей"
                                />
                            )}
                            <div className="profile__top-content-friends-content">
                                {isLoadingProfile ? (
                                    <ProfileFriendsSkeleton />
                                ) : statusFriend ? (
                                    friends.length ? (
                                        friends
                                    ) : (
                                        "Нет друзей"
                                    )
                                ) : friendsRequest.length ? (
                                    <>
                                        {friendsRequest}
                                        {console.log(friendsRequest)}
                                    </>
                                ) : (
                                    "Нет заявок"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile__content">
                    <div className={profile.isOnSetting ? "profile__content-settings profile__content-settings_active" : "profile__content-settings"} onClick={() => profile.setIsOnSetting(!profile.isOnSetting)}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="#1C274C"></path>
                            </g>
                        </svg>
                    </div>
                    {/* {user.user.id == id && (
            <div className="profile__menu-wrapper">
              <ProfileMenu id={id} onClick={checkPrevId} />
            </div>
          )} */}

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
                                            {
                                                item.element
                                            }
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
