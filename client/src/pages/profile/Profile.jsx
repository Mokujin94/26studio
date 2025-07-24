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
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { MESSENGER_ROUTE, PROFILE_ROUTE } from "../../utils/consts";
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
import { useDateFormatter } from "../../hooks/useDateFormatter";
import Skeleton from "../../components/Skeletons/Skeleton";

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
	const [searchFriendValue, setSearchFriendValue] = useState('');
	const [foundFriends, setFoundFriends] = useState([]);
	const [offsetMenuLineActive, setOffsetMenuLineActive] = useState(
		100 / profile.menuItemsOtherUser.length
	);

	const [friendsRequest, setFriendsRequest] = useState([]);
	const [friends, setFriends] = useState([]);
	const [sortFriends, setSortFriends] = useState([]);
	const [statusFriend, setStatusFriend] = useState(false);

	const [isOnline, setIsOnline] = useState(false)
	const [lastTimeOnline, setLastTimeOnline] = useState('')

	const miniatureRef = useRef(null);

	useClickOutside(miniatureRef, () => {
		setAvatarFile(null);
		user.setModalProfileMiniature(false);
		setTimeout(() => {
			setAvatarReader(null);
		}, 300);
	});

	useEffect(() => {
		profile.setIsLoadingProfile(true);
		setFriendsRequest([]);
		setFriends([]);
		setFoundFriends([])
		setSearchFriendValue("")
		profile.setSelectedMenu({ id: 0, title: "Проекты" });
		setStatusFriend(true);
		fetchUserById(Number(id))
			.then((dataUser) => {

				const lastOnline = new Date(dataUser.lastOnline).getTime() / 1000;
				const nowTime = new Date().getTime() / 1000;
				if ((nowTime - lastOnline) <= 300) {
					setIsOnline(true)
				} else {
					const time = useDateFormatter(dataUser.lastOnline)
					setLastTimeOnline(time);
					setIsOnline(false)
				}
				document.title = `${dataUser.name}`
				setUserId(dataUser);
				if (dataUser.group_status) {
					setGroup(dataUser.groups[0].name);
				} else {
					setGroup(`${dataUser.groups[0].name} (Группа не подтверджена)`);
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
									item.friendId == dataUser.id ? item.userId : item.friendId
								}
								key={item.id}
							/>
						));

					const requestsAll = dataUser.friends
						.filter((item) => !item.status && item.userId !== dataUser.id)
						.map((item) => (
							<FriendCard
								userId={
									item.friendId == dataUser.id ? item.userId : item.friendId
								}
								key={item.id}
							/>
						));
					setFriends(friendsAll)
					setFriendsRequest(requestsAll)
				}

				const sortFriendsAllPromises = dataUser.friends.map(async item => {
					return await fetchUserById(Number(item.friendId == dataUser.id ? item.userId : item.friendId))
				})
				Promise.all(sortFriendsAllPromises)
					.then(sortedFriends => {
						setSortFriends(sortedFriends)
					})
					.catch();
			})
			.then(() => {
				profile.setIsLoadingProfile(false);
			})
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
							return setTextButton("Удалить из друзей");
						}
					} else {
						if (item.userId === user.user.id) {
							return setTextButton("Отменить заявку");
						}
						if (item.friendId === user.user.id) {
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
			}).catch(err => {
				if (err.response.data.message === "Пользователь добавлен в друзья") {
					modal.setModalComplete(true);
					modal.setModalCompleteMessage(
						`Пользователь ${userId.name} теперь у вас в друзьях`
					);
					setTextButton("Удалить из друзей");
				}
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

	const onSearchFriend = (e) => {
		setSearchFriendValue(e.target.value)
		if (e.target.value) {
			const friendsFindAll = sortFriends.filter(item => {
				// Приводим каждый элемент массива и запрос к нижнему регистру для регистронезависимого поиска
				const itemNameLower = item.name.toLowerCase().replace(/\s/g, '');
				const itemFullNameLower = item.full_name.toLowerCase().replace(/\s/g, '');
				const queryLower = e.target.value.toLowerCase().replace(/\s/g, '');
				// Используем метод includes() для проверки, содержится ли запрос в элементе массива
				return itemNameLower.includes(queryLower) || itemFullNameLower.includes(queryLower);
			});


			if (friendsFindAll.length) {


				const friends = friendsFindAll.map((item) => (
					<FriendCard
						userId={item.id}
						key={item.id}
					/>
				))
				setFoundFriends(friends)
			} else {
				setFoundFriends([])
			}
		} else {
			setFoundFriends([])
		}
	}

	return (
		<div className="profile">
			<div className="container">
				<div className="profile__inner">
					<div className="profile__left">
						<CSSTransition
							in={user.modalProfileMiniature}
							timeout={300}
							classNames="create-anim"
							unmountOnExit
						>
							<div className="profile__left-miniature-modal">
								<div
									className="profile__left-miniature-modal-content"
									ref={miniatureRef}
								>
									<div className="profile__left-miniature-modal-img">
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
							className="profile__left-user"
							style={profile.isLoadingProfile ? { padding: "0px" } : null}
						>
							{profile.isLoadingProfile ? (
								<ProfileMainSkeleton />
							) : (
								<>
									<div className="profile__left-user-face">
										<div className={"profile__left-user-avatar"}>
											{Number(id) === user.user.id ? (
												<label htmlFor="avatar" className="profile__left-user-avatar-inner">
													<img
														className="profile__left-user-avatar-img"
														src={
															id == user.user.id
																? process.env.REACT_APP_API_URL + user.user.avatar
																: process.env.REACT_APP_API_URL + userId.avatar
														}
														alt="icon"
													/>
													<input
														className="profile__left-user-avatar-input"
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
												<>
													<img
														className="profile__left-user-avatar-img"
														src={
															id == user.user.id
																? process.env.REACT_APP_API_URL + user.user.avatar
																: process.env.REACT_APP_API_URL + userId.avatar
														}
														alt="icon"
													/>

													{
														isOnline
															?
															<div className="profile__left-user-avatar-online profile__left-user-avatar-online_true"></div>
															:
															<div className="profile__left-user-avatar-online profile__left-user-avatar-online_false">
																{lastTimeOnline.replace(' назад', '')}
															</div>
													}
												</>

											)}
										</div>

										{user.user.id == id ? (
											<div className="profile__left-user-button">
												<FunctionButton onClick={() => profile.setEditModal(true)}>Редактировать</FunctionButton>
											</div>
										) : user.user.id ? (
											<div className="profile__left-user-button profile__left-user-button_other">
												<>
													<FunctionButton onClick={onClickFriend}>
														{textButton}
													</FunctionButton>
													<Link className="profile__left-user-button-message" to={MESSENGER_ROUTE + "/#" + id} title={`Написать`}>
														<svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z" fill="#ffffff"></path> </g></svg>
													</Link>
												</>
											</div>
										) : (
											<div className="profile__left-user-button">
												<FunctionButton>Добавить в друзья</FunctionButton>
											</div>
										)}

										{/* <div className="profile__left-user-socials">
												<div className="profile__left-user-socials-icon">
													<img
														className="profile__left-user-socials-icon-img"
														src={git}
														alt="icon"
													/>
												</div>
												<div className="profile__left-user-socials-icon">
													<img
														className="profile__left-user-socials-icon-img"
														src={tg}
														alt="icon"
													/>
												</div>
												<div className="profile__left-user-socials-icon">
													<img
														className="profile__left-user-socials-icon-img"
														src={vk}
														alt="icon"
													/>
												</div>
											</div> */}
									</div>

									<div className="profile__left-user-info">
										<div className="profile__left-user-name">

											<div className="profile__left-user-nickname">{id === user.user.id ? user.user.name : userId.name}</div>
											{/* <img
											className="profile__left-user-achievement"
											src={achievement}
											alt=""
										/> */}
										</div>
										<div className="profile__left-user-more-info">
											<div className="profile__left-user-full-name">{id === user.user.id ? user.user.full_name : userId.full_name}</div>
											<div className="profile__left-user-group">{id === user.user.id ? user.user.group.name : group}</div>
										</div>
										<div className="profile__left-user-description">
											{/* 520 символов максимум  */}
											<p className={Number(id) === user.user.id ? "profile__left-user-description-text profile__left-user-description-text_edit" : "profile__left-user-description-text"} onClick={Number(id) === user.user.id ? () => profile.setEditModal(true) : null}>{descr === 'Нет описания' && Number(id) === user.user.id ? "Расскажите о себе" : descr}</p>
										</div>
									</div>
								</>
							)}
						</div>
						<div className="profile__left-content">

							{/* {user.user.id == id && (
								<div className="profile__left-contentmenu-wrapper">
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
															? "profile__left-content-main profile__left-content-main-settings"
															: profile.selectedMenu.id === 2
																? "profile__left-content-main profile__left-content-main-achievement"
																: "profile__left-content-main"
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
					<div className="profile__friends">
						{user.user.id == id ? (
							<ul className="profile__friends-menu">
								<li
									className={
										statusFriend
											? "profile__friends-menu-item profile__friends-menu-item_active"
											: "profile__friends-menu-item"
									}
									onClick={() => {
										setStatusFriend(true);
									}}
								>
									{friends.length
										?
										`Друзья (${friends.length})`
										: 'Друзья'
									}
								</li>
								<li
									className={
										!statusFriend
											? "profile__friends-menu-item profile__friends-menu-item_active"
											: "profile__friends-menu-item"
									}
									onClick={() => {
										setStatusFriend(false);
									}}
								>
									{friendsRequest.length
										?
										<>
											{`Заявки (${friendsRequest.length})`}
											<div className="profile__friends-menu-item-circle"></div>
										</>
										: 'Заявки'
									}
								</li>
							</ul>
						) : (
							<ul className="profile__friends-menu">
								<li
									className={
										"profile__friends-menu-item profile__friends-menu-item_other"
									}
								>
									{friends.length
										?
										`Друзья (${friends.length})`
										: 'Друзья'
									}
								</li>
							</ul>
						)}

						<div className="profile__friends-inner">
							{statusFriend && id == user.user.id && (
								<input
									type="text"
									className="profile__friends-search"
									placeholder="Поиск друзей"
									value={searchFriendValue}
									onChange={onSearchFriend}
								/>
							)}
							<div className={((statusFriend && !friends.length && !profile.isLoadingProfile) || (!statusFriend && !friendsRequest.length && !profile.isLoadingProfile)) ? "profile__friends-content" + " " + "profile__friends-content_center" : "profile__friends-content"}>
								{
									profile.isLoadingProfile ? (
										<div className="profile__friends-content">
											<Skeleton key={id} width={370} height={100} backgroundColor={"#222c36"} />
											<Skeleton key={id} width={370} height={100} backgroundColor={"#222c36"} />
											<Skeleton key={id} width={370} height={100} backgroundColor={"#222c36"} />
											<Skeleton key={id} width={370} height={100} backgroundColor={"#222c36"} />
											<Skeleton key={id} width={370} height={100} backgroundColor={"#222c36"} />
										</div>
									) : statusFriend ? (
										friends.length && !searchFriendValue ? (
											friends
										) : friends.length && foundFriends.length ? foundFriends : !friends.length && (
											"Нет друзей"
										)
									) : friendsRequest.length ? (
										friendsRequest
									) : (
										"Нет заявок"
									)
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default Profile;
