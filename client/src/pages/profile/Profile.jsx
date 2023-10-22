import React, { createRef, useContext, useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition, Transition, TransitionGroup } from 'react-transition-group';

import FunctionButton from '../../components/functionButton/FunctionButton';
import ProfileMenu from '../../components/profileMenu/ProfileMenu';
import FriendCard from '../../components/friendCard/FriendCard';
import AchievementCard from '../../components/achievementCard/AchievementCard';
import ProfileProjects from '../../components/profilProjects/ProfileProjects';

import avatar from '../../resource/graphics/images/profile/avatar.jpg';
import addUser from '../../resource/graphics/icons/profile/add-user.svg';
import vk from '../../resource/graphics/icons/profile/vk.svg';
import tg from '../../resource/graphics/icons/profile/tg.svg';
import git from '../../resource/graphics/icons/profile/git.svg';
import achievement from '../../resource/graphics/icons/profile/achievement.svg';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import { fetchGroups } from '../../http/groupsAPI';
import { fetchUserById } from '../../http/userAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { PROFILE_ROUTE } from '../../utils/consts';

const Profile = observer(() => {
  const { profile, user, groups } = useContext(Context);
  const [group, setGroup] = useState('');
  const [userId, setUserId] = useState({});

  const { id } = useParams();

  const nav = useNavigate();

  useEffect(() => {
    fetchUserById(id)
      .then((dataUser) => {
        setUserId(dataUser);
        fetchGroups().then((dataGroup) => {
          dataGroup.rows.map((item) => {
            if (dataUser.groupId == item.id) {
              setGroup(item.name);
            }
          });
          console.log(1);
        });
      })
      .catch((err) => {
        nav(PROFILE_ROUTE + '/2');
      });
  }, []);

  const [prevId, setPrevId] = useState(0);
  const [boolPrevId, setBoolPrevId] = useState(false);

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
    const root = document.querySelector(':root');
    if (!boolPrevId) {
      root.style.setProperty('--transform', '2000px');
    } else {
      root.style.setProperty('--transform', '-2000px');
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [boolPrevId, prevId]);

  return (
    <div className="profile">
      <div className="container">
        <div className="profile__top-wrapper">
          <div className="profile__face">
            <div className="profile__avatar">
              <img
                className="profile__avatar-img"
                src={
                  id == user.user.id
                    ? process.env.REACT_APP_API_URL + user.user.avatar
                    : process.env.REACT_APP_API_URL + userId.avatar
                }
                alt="icon"
              />
            </div>

            <div className="profile__button">
              <FunctionButton>{id == user.user.id ? 'Редактировать' : 'Добавить в друзья'}</FunctionButton>
            </div>

            <div className="profile__socials">
              <div className="profile__socials-icon">
                <img className="profile__socials-icon-img" src={git} alt="icon" />
              </div>
              <div className="profile__socials-icon">
                <img className="profile__socials-icon-img" src={tg} alt="icon" />
              </div>
              <div className="profile__socials-icon">
                <img className="profile__socials-icon-img" src={vk} alt="icon" />
              </div>
            </div>
          </div>

          <div className="profile__info">
            <div className="profile__name">
              <div className="profile__nickname">{id == user.user.id ? user.user.name : userId.name}</div>
              <img className="profile__achievement" src={achievement} alt="" />
            </div>
            <div className="profile__more-info">
              <div className="profile__full-name">{id == user.user.id ? user.user.full_name : userId.full_name}</div>
              <div className="profile__group">{group}</div>
            </div>
            <div className="profile__description">
              {id == user.user.id ? user.user.description : userId.description}
            </div>
          </div>
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
                          ? 'profile__content-main profile__content-main-settings'
                          : profile.selectedMenu.id === 2
                          ? 'profile__content-main profile__content-main-achievement'
                          : 'profile__content-main'
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
