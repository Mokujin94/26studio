import React, { createRef, useState } from 'react'
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group'

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




function Profile() {

  const [menuItems, setMenuItems] = useState(() => [
    {id: 0, element: <ProfileProjects/>, nodeRef: createRef(null)},
    {id: 1, element: <AchievementCard/>, nodeRef: createRef(null)},
    {id: 2, element: <FriendCard/>, nodeRef: createRef(null)},
    {id: 3, element: 'test', nodeRef: createRef(null)},
  ])

  const [menuSelected, setMenuSelected] = useState(0)

  const changeSelected = (i) => {
      setMenuSelected(i)
  }

  // const menuItem = menu.map(({id, element}) => {
  //   if (menuSelected === id) {
  //     return (

  //     )
  //   }

  // })

  


  return (
    <div className="profile">
      <div className="container">
        <div className="profile__top-wrapper">
          <div className="profile__face">
            <div className="profile__avatar">
              <img className='profile__avatar-img' src={avatar} alt="" />
              <img className='profile__avatar-add' src={addUser} alt="" />
            </div>

            <div className="profile__button">
              <FunctionButton>
                Редактировать
              </FunctionButton>
            </div>

            <div className="profile__socials">
              <div className="profile__socials-icon">
                <img className='profile__socials-icon-img' src={git} alt="" />
              </div>
              <div className="profile__socials-icon">
                <img className='profile__socials-icon-img'  src={tg} alt="" />
              </div>
              <div className="profile__socials-icon">
                <img className='profile__socials-icon-img' src={vk} alt="" />
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
            <ProfileMenu onSelected={changeSelected} selected={menuSelected}/>
          </div>
            <TransitionGroup className="transition-group">
              {menuItems.map(({id, element, nodeRef}) => {
                if (menuSelected === id) {
                  return (
                    <CSSTransition
                      key={id}
                      nodeRef={nodeRef}
                      timeout={600}
                      classNames="item"
                    >
                      <div className="profile__content-main" ref={nodeRef}>
                        {element}
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
}

export default Profile