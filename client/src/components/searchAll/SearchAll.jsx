import React, { useContext } from 'react'

import style from './searchAll.module.scss'
import { Context } from '../..'
import Spinner from '../spinner/Spinner';

function SearchAll({search, searchData, isLoading}) {
    const {user} = useContext(Context);
    

    const usersBox = 
    search && !isLoading && searchData.users && searchData.users.length > 0
    &&         
    <div className={style.search__content}>
    <div className={style.search__content__box}>
        <div className={style.search__content__box__info}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 22 15" fill="none">
                <path d="M10.9955 6.55032C12.633 6.55055 13.9682 5.23762 13.9955 3.60032V2.48032C13.9956 1.8156 13.7288 1.17866 13.255 0.712403C12.7812 0.246146 12.1401 -0.0103984 11.4755 0.000323034H10.5255C9.15971 0.00583017 8.05546 1.11455 8.05547 2.48032V3.60032C8.08206 5.21455 9.38135 6.51825 10.9955 6.55032Z" fill="#97BCE6"/>
                <path d="M21.5955 11.7103L21.4755 10.2003C21.3458 9.442 20.6947 8.88335 19.9255 8.87032H15.6055C15.5392 8.86001 15.4717 8.86001 15.4055 8.87032C15.0222 8.43984 14.4718 8.19564 13.8955 8.20032H8.10547C7.49511 8.19766 6.91694 8.47385 6.53547 8.95032C6.37208 8.89058 6.19944 8.86012 6.02547 8.86032H1.70547C0.933055 8.87422 0.280881 9.43803 0.155468 10.2003L0.0354682 11.7603C-0.0650242 12.2387 0.0504501 12.7371 0.351099 13.1225C0.651748 13.508 1.107 13.7413 1.59547 13.7603H6.14547C6.23517 13.7707 6.32577 13.7707 6.41547 13.7603C6.81209 14.1981 7.37475 14.4486 7.96547 14.4503H14.0355C14.6082 14.4476 15.1545 14.2088 15.5455 13.7903H20.0355C20.5417 13.7763 21.0138 13.5321 21.3176 13.127C21.6215 12.7218 21.7238 12.2002 21.5955 11.7103Z" fill="#97BCE6"/>
                <path d="M17.8155 7.31032C19.0305 7.31032 20.0155 6.32535 20.0155 5.11032V4.26032C20.0157 3.76089 19.8139 3.28259 19.4561 2.93418C19.0982 2.58576 18.6147 2.39682 18.1155 2.41032H17.4155C16.3937 2.41032 15.5655 3.2386 15.5655 4.26032V5.11032C15.5653 5.70257 15.804 6.26986 16.2274 6.68391C16.6509 7.09795 17.2234 7.32378 17.8155 7.31032Z" fill="#97BCE6"/>
                <path d="M3.86547 7.31032C5.0805 7.31032 6.06547 6.32535 6.06547 5.11032V4.26032C6.06547 3.2386 5.2372 2.41032 4.21547 2.41032H3.51547C2.49374 2.41032 1.66547 3.2386 1.66547 4.26032V5.11032C1.66547 6.32535 2.65044 7.31032 3.86547 7.31032Z" fill="#97BCE6"/>
            </svg>
            <h2 className={style.search__content__box__info__title}>Пользователи ({searchData.users.length})</h2>
        </div>
        <div className={style.search__content__arrow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" fill="none">
                <path d="M1.5 1.5L7.26263 7.93043C7.94318 8.68986 9.05682 8.68986 9.73737 7.93043L15.5 1.5" stroke="#97BCE6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
    <ul className={style.search__content__list}>
        {searchData.users.map(item => {
            return (
                <li className={style.search__content__list__item}>
                    <div className={style.search__content__list__item__info}>
                        <div className={style.search__user}>
                            <img src={process.env.REACT_APP_API_URL + '/' + item.avatar} alt="" className={style.search__user__img} />
                        </div>
                        <h2 className={style.search__user__name}>{item.name}</h2>
                    </div>
                    <div className={style.search__content__list__item__info}>
                        <h2 className={style.search__user__group}>{item.groupId}</h2>
                    </div>
                </li>
            )
        })}
    </ul>
</div>

const projectsBox = search && !isLoading && searchData.projects && searchData.projects.length > 0
&&         
<div className={style.search__content}>
<div className={style.search__content__box}>
    <div className={style.search__content__box__info}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 22 15" fill="none">
            <path d="M10.9955 6.55032C12.633 6.55055 13.9682 5.23762 13.9955 3.60032V2.48032C13.9956 1.8156 13.7288 1.17866 13.255 0.712403C12.7812 0.246146 12.1401 -0.0103984 11.4755 0.000323034H10.5255C9.15971 0.00583017 8.05546 1.11455 8.05547 2.48032V3.60032C8.08206 5.21455 9.38135 6.51825 10.9955 6.55032Z" fill="#97BCE6"/>
            <path d="M21.5955 11.7103L21.4755 10.2003C21.3458 9.442 20.6947 8.88335 19.9255 8.87032H15.6055C15.5392 8.86001 15.4717 8.86001 15.4055 8.87032C15.0222 8.43984 14.4718 8.19564 13.8955 8.20032H8.10547C7.49511 8.19766 6.91694 8.47385 6.53547 8.95032C6.37208 8.89058 6.19944 8.86012 6.02547 8.86032H1.70547C0.933055 8.87422 0.280881 9.43803 0.155468 10.2003L0.0354682 11.7603C-0.0650242 12.2387 0.0504501 12.7371 0.351099 13.1225C0.651748 13.508 1.107 13.7413 1.59547 13.7603H6.14547C6.23517 13.7707 6.32577 13.7707 6.41547 13.7603C6.81209 14.1981 7.37475 14.4486 7.96547 14.4503H14.0355C14.6082 14.4476 15.1545 14.2088 15.5455 13.7903H20.0355C20.5417 13.7763 21.0138 13.5321 21.3176 13.127C21.6215 12.7218 21.7238 12.2002 21.5955 11.7103Z" fill="#97BCE6"/>
            <path d="M17.8155 7.31032C19.0305 7.31032 20.0155 6.32535 20.0155 5.11032V4.26032C20.0157 3.76089 19.8139 3.28259 19.4561 2.93418C19.0982 2.58576 18.6147 2.39682 18.1155 2.41032H17.4155C16.3937 2.41032 15.5655 3.2386 15.5655 4.26032V5.11032C15.5653 5.70257 15.804 6.26986 16.2274 6.68391C16.6509 7.09795 17.2234 7.32378 17.8155 7.31032Z" fill="#97BCE6"/>
            <path d="M3.86547 7.31032C5.0805 7.31032 6.06547 6.32535 6.06547 5.11032V4.26032C6.06547 3.2386 5.2372 2.41032 4.21547 2.41032H3.51547C2.49374 2.41032 1.66547 3.2386 1.66547 4.26032V5.11032C1.66547 6.32535 2.65044 7.31032 3.86547 7.31032Z" fill="#97BCE6"/>
        </svg>
        <h2 className={style.search__content__box__info__title}>Проекты ({searchData.projects.length})</h2>
    </div>
    <div className={style.search__content__arrow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" fill="none">
            <path d="M1.5 1.5L7.26263 7.93043C7.94318 8.68986 9.05682 8.68986 9.73737 7.93043L15.5 1.5" stroke="#97BCE6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</div>
<ul className={style.search__content__list}>
    {searchData.projects.map(item => {
        return (
            <li className={style.search__content__list__item}>
                <div className={style.search__content__list__item__info}>
                    <div className={style.search__user}>
                        <img src={process.env.REACT_APP_API_URL + '/' + item.preview} alt="" className={style.search__user__img} />
                    </div>
                    <h2 className={style.search__user__name}>{item.name}</h2>
                </div>
                <div className={style.search__content__list__item__info}>
                </div>
            </li>
        )
    })}
</ul>
</div>
  return (
    
    <div className={style.search}>
        {isLoading && <Spinner/>}
        {usersBox}
        {projectsBox}
        {searchData.length && !isLoading && <h2>не найдено</h2>}
    </div>
  )
}

export default SearchAll