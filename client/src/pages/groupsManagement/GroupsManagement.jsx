import React from 'react'
import FriendCard from "../../components/friendCard/FriendCard"

import './groupsManagement.scss'

function GroupsManagement() {
  return (
    <div className='container'>
        <div className="groupsManagement">
            <h1 className="groupsManagement__title">Управление группами</h1>
            <div className="groupsManagement__inner">
                <div className="groupsManagement__settings">
                    <div className="groupsManagement__settings-left">
                        <div className="groupsManagement__settings-left-item groupsManagement__settings-left-item_active">
                            Все участники
                        </div>
                        <div className="groupsManagement__settings-left-item">
                            Заявки
                        </div>

                    </div>
                    <div className="groupsManagement__settings-right">
                        <div className="groupsManagement__settings-right-item">
                            <select className='groupsManagement__settings-right-item-select'>
                                <option value="1">Выбор группы</option>
                                <option value="1">ИС 11/9</option>
                            </select>
                            <svg className='groupsManagement__settings-right-item-icon' xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                <path d="M1 1L7 7L13 1" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            
                        </div>
                        <div className="groupsManagement__settings-right-item">
                            <select className='groupsManagement__settings-right-item-select'> 
                                <option value="1">Определить куратора</option>
                                <option value="1">Ксения Эдуардовна</option>
                            </select>
                            <svg className='groupsManagement__settings-right-item-icon' xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                <path d="M1 1L7 7L13 1" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            
                        </div>
                        <div className="groupsManagement__settings-right-item">
                            <input type="text" className='groupsManagement__settings-right-item-search' placeholder='Поиск студента'/>
                            <svg className='groupsManagement__settings-right-item-icon' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M15 15L12.2779 12.2778M14.2222 7.61111C14.2222 11.2623 11.2623 14.2222 7.61111 14.2222C3.95989 14.2222 1 11.2623 1 7.61111C1 3.95989 3.95989 1 7.61111 1C11.2623 1 14.2222 3.95989 14.2222 7.61111Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div className="groupsManagement__settings-right-item">
                            <div className="groupsManagement__settings-right-item-button">Создать</div>
                        </div>

                    </div>
                </div>
                <div className="groupsManagement__wrapper">
                    <FriendCard/>
                    <FriendCard/>
                    <FriendCard/>
                    <FriendCard/>
                    <FriendCard/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GroupsManagement