import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import {
  CSSTransition,
  SwitchTransition,
  Transition,
  TransitionGroup,
} from "react-transition-group";

import FunctionButton from "../../components/functionButton/FunctionButton";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";

import ReactCrop, { centerCrop, convertToPercentCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'
import setCanvasPreview from "../../hooks/setCanvasPreview";

import vk from "../../resource/graphics/icons/profile/vk.svg";
import tg from "../../resource/graphics/icons/profile/tg.svg";
import git from "../../resource/graphics/icons/profile/git.svg";
import notification from "../../resource/audio/notification.mp3";
import achievement from "../../resource/graphics/icons/profile/achievement.svg";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { fetchGroups } from "../../http/groupsAPI";
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

const Profile = observer(() => {
  const { profile, user, groups, modal } = useContext(Context);
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
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const miniatureRef = useRef(null)
  const imageMiniatureRef = useRef(null)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const blobUrlRef = useRef("");
  const hiddenAnchorRef = useRef("")

   useClickOutside(miniatureRef, () => {
      setAvatarFile(null)
      user.setModalProfileMiniature(false)
      setTimeout(() => {
        setCrop(null)
        setAvatarReader(null)
      }, 300)
  })

  useEffect(() => {
    profile.setSelectedMenu({ id: 0, title: "Проекты" });
    fetchUserById(id)
      .then((dataUser) => {
        setUserId(dataUser);
        setGroup(dataUser.group.name);
      })
      .catch((err) => {
        nav(PROFILE_ROUTE + "/" + user.user.id);
      });

    if (user.user.id) {
      if (Number(id) === user.user.id) {
        setTextButton("Редактировать");
      } else {
        getFriends(id).then((data) => {
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
    } else {
      return setTextButton("Добавить в друзья");
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
        .catch(() => {
          modal.setModalComplete(true);
          modal.setModalCompleteMessage(
            `${userId.name} уже хочет быть вашим другом`
          );
          setTextButton("Принять заявку");
        });
    } else if (textButton === "Отменить заявку") {
      return deleteFriend(user.user.id, id).then(() => {
        modal.setModalComplete(true);
        modal.setModalCompleteMessage("Заявка отменена");
        setTextButton("Добавить в друзья");
      });
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
        });
    } else if (textButton === "Удалить из друзей") {
      return deleteFriend(user.user.id, id).then(() => {
        modal.setModalComplete(true);
        modal.setModalCompleteMessage(
          `Пользователь ${userId.name} удалён из друзей`
        );
        setTextButton("Добавить в друзья");
      });
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

  useEffect(() => {
    console.log(avatarFile);
    if (!avatarFile) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarReader(reader.result);
      console.log(reader.result);
    };
    reader.readAsDataURL(avatarFile);
}, [avatarFile, user.modalProfileMiniature]);

  const onProfileImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthPrecent = (150 / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthPrecent,
      },
      1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height)
    setCrop(centeredCrop);
  }

  // const onButtonProfileMiniature = async () => {
  //   const image = imageMiniatureRef.current;
  //   const previewCanvas = canvasRef.current;
  //   if (!image || !previewCanvas || !completedCrop) {
  //     throw new Error("Crop canvas does not exist");
  //   }

  //   // This will size relative to the uploaded image
  //   // size. If you want to size according to what they
  //   // are looking at on screen, remove scaleX + scaleY
  //   const scaleX = image.width / image.width;
  //   const scaleY = image.height / image.height;

  //   const offscreen = new OffscreenCanvas(
  //     completedCrop.width * scaleX,
  //     completedCrop.height * scaleY,
  //   );
  //   const ctx = offscreen.getContext("2d");
  //   if (!ctx) {
  //     throw new Error("No 2d context");
  //   }

  //   ctx.drawImage(
  //     previewCanvas,
  //     0,
  //     0,
  //     previewCanvas.width,
  //     previewCanvas.height,
  //     0,
  //     0,
  //     offscreen.width,
  //     offscreen.height,
  //   );
  //   // You might want { type: "image/jpeg", quality: <0 to 1> } to
  //   // reduce image size
  //   const blob = await offscreen.convertToBlob({
  //     type: "image/jpeg",
  //   });

  //   if (blobUrlRef.current) {
  //     URL.revokeObjectURL(blobUrlRef.current);
  //   }
  //   blobUrlRef.current = URL.createObjectURL(blob);
  //   const file = await blobToFile(blob, 'avatarFile.jpg')
  //   console.log(file);
  //   hiddenAnchorRef.current.href = blobUrlRef.current;
  //   hiddenAnchorRef.current.click();
  //   console.log(blobUrlRef.current);
  //   const formData = new FormData()
  //   formData.append('avatar', file)
  //   updateAvatar(user.user.id, formData).then((data) => {
  //     console.log(data);
  //   }).catch((e) => console.log(e))
  // }

  // async function blobToFile (blob, fileName) {
  //   // Создаем массив байтов из Blob
  //   const arrayBuffer = await blob.arrayBuffer();

  //   // Создаем File из массива байтов
  //   const file = new File([arrayBuffer], fileName, { type: blob.type });

  //   return file;
  // };

  const completeAvatar = (c) => {
    setCompletedCrop(c)
    
  }

  return (
    <div className="profile">
      <div className="container">
        <div className="profile__top-content">
          {
            <CSSTransition
              in={user.modalProfileMiniature}
              timeout={300}
              classNames="create-anim"
              unmountOnExit
              >
              <div className="profile__miniature-modal">
                <div className="profile__miniature-modal-content" ref={miniatureRef}>
                  <div className="profile__miniature-modal-img">
                    <ReactCrop
                      crop={crop}
                      circularCrop
                      aspect={1} 
                      keepSelection 
                      onComplete={(c) => completeAvatar(c)} 
                      onChange={(pixelCrop, precentCrop) => setCrop(precentCrop)}
                      minWidth={150}
                    >
                      <img ref={imageMiniatureRef} src={avatarReader} style={{maxHeight: '500px'}} onLoad={onProfileImageLoad}/>
                    </ReactCrop>
                  </div>
                  <div className="profile__miniature-modal-btn">
                    {/* <FunctionButton onClick={onButtonProfileMiniature}>Загрузить фотографию</FunctionButton> */}
                    <FunctionButton
                      onClick={() => setCanvasPreview(
                      imageMiniatureRef.current,
                      canvasRef.current,
                      convertToPercentCrop(
                        crop,
                        imageMiniatureRef.current.width,
                        imageMiniatureRef.current.height
                      )
                      )}>
                      Загрузить фотографию
                    </FunctionButton>
                  </div>
                </div>
                <a href="#" onClick={(e) => e.preventDefault} ref={hiddenAnchorRef} download style={{display: 'none'}}></a>
                <canvas
                  ref={canvasRef}
                  style={completedCrop && {
                    width: completedCrop.width,
                    height: completedCrop.height,
                    position: 'absolute',
                    top: '40%',
                    display: 'block',
                    zIndex: '10'
                  }}
                />
                <img ref={imgRef} src="" alt="" style={{display: 'none'}}/>
              </div>
            </CSSTransition>
          }
          
          
          <div className="profile__top-wrapper">
            <div className="profile__face">
              <div className="profile__avatar">
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
                      e.target.value = ''
                    }}
                    onChange={(e) => {
                      user.setModalProfileMiniature(true)
                      setAvatarFile(e.target.files[0]);
                      }
                    }
                    type="file"
                    name="avatar"
                    id="avatar"
                    accept="image/png, image/jpeg"
                  />
                </label>
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
                <img
                  className="profile__achievement"
                  src={achievement}
                  alt=""
                />
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
          <div className="profile__top-wrapper"></div>
        </div>
        <div className="profile__content">
          <div className="profile__menu-wrapper">
            <ProfileMenu id={id} onClick={checkPrevId} />
          </div>
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
