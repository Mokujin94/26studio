import React, { createRef, useContext, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition, Transition, TransitionGroup } from 'react-transition-group'

import FunctionButton from '../../components/functionButton/FunctionButton'
import ProfileMenu from '../../components/profileMenu/ProfileMenu'
import FriendCard from '../../components/friendCard/FriendCard'
import AchievementCard from '../../components/achievementCard/AchievementCard'
import ProfileProjects from '../../components/profilProjects/ProfileProjects'


import avatar from '../../resource/graphics/images/profile/avatar.jpg'
import addUser from '../../resource/graphics/icons/profile/add-user.svg'
import vk from '../../resource/graphics/icons/profile/vk.svg'
import tg from '../../resource/graphics/icons/profile/tg.svg'
import git from '../../resource/graphics/icons/profile/git.svg'
import achievement from '../../resource/graphics/icons/profile/achievement.svg'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'




const Profile = observer(() => {
  const {profile} = useContext(Context)

  const [prevId, setPrevId] = useState(0)
  const [boolPrevId, setBoolPrevId] = useState(false)

  const checkPrevId = (item) => {
    profile.setSelectedMenu(item)
    // if(prevId == profile.selectedMenu.id){
    //   return
    // } else {
      if (prevId > profile.selectedMenu.id) {
        setBoolPrevId(false)
        setPrevId(profile.selectedMenu.id)
      } else if (prevId < profile.selectedMenu.id) {
        setBoolPrevId(true)
        setPrevId(profile.selectedMenu.id)
      }
    // }

  }

  // const defaultStyle = {
  //   transition: `opacity 100ms ease-in-out`,
  //   opacity: 1,
  // }

  const transitionStyles = {
    entering: { 
      opacity: 0,
      transform: 'translateX(-2000px)' 
    },
    entered:  {
      position: 'absolute',
      opacity: 1,
      transition: '0.5s ease-in-out',
      transform: 'translateX(0px)',
    },
    exiting:  {
      opacity: 1,
      transform: 'translateX(0px)'
    },
    exited:  {
      opacity: 0,
      transition: '0.5s ease-in-out',
      transform: 'translateX(-2000px)',
    },
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
      behavior: "smooth"
    });
  console.log(root)
  }, [boolPrevId, prevId])

  console.log(prevId);


  return (
    <div className="profile">
      <div className="container">
        <div className="profile__top-wrapper">
          <div className="profile__face">
            <div className="profile__avatar">
              <img className='profile__avatar-img' src={avatar} alt="icon" />
              <img className='profile__avatar-add' src={addUser} alt="icon" />
            </div>

            <div className="profile__button">
              <FunctionButton>
                Редактировать
              </FunctionButton>
            </div>

            <div className="profile__socials">
              <div className="profile__socials-icon">
                <img className='profile__socials-icon-img' src={git} alt="icon" />
              </div>
              <div className="profile__socials-icon">
                <img className='profile__socials-icon-img'  src={tg} alt="icon" />
              </div>
              <div className="profile__socials-icon">
                <img className='profile__socials-icon-img' src={vk} alt="icon" />
              </div>

            </div>
          </div>

          <div className="profile__info">
            <div className="profile__name">
              <div className="profile__nickname">Breeze</div>
              <img className="profile__achievement" src={achievement} alt="" />
            </div>
            <div className="profile__more-info">
              <div className="profile__full-name">Ролдугин Илья Блендорович</div>
              <div className="profile__group">ИС 31/9 </div>
            </div>
            <div className="profile__description">Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста</div>
          </div>
        </div>
        <div className="profile__content">
          <div className="profile__menu-wrapper">
            <ProfileMenu onClick={checkPrevId}/>
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
                      <div className={profile.selectedMenu.id === 3 ? 'profile__content-main profile__content-main-settings' : profile.selectedMenu.id === 2 ? 'profile__content-main profile__content-main-achievement' : 'profile__content-main' } ref={item.nodeRef}>
                        {item.element}
                      </div>

                    </CSSTransition>
                  )
                }
              })}
            </TransitionGroup>
        </div>
      </div>
    </div>
  )
})

export default Profile