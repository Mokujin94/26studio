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
				setUserId(dataUser);
				console.log(dataUser);
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
	}, [user.user.id, userId]);

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
