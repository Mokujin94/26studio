import React from 'react'

import style from './header.module.scss'

import logo from '../../resource/graphics/icons/footer/footer_logo.svg'
import search from '../../resource/graphics/icons/header/search.svg'

function Header() {


  return (
    <header className={style.header}>
        <div className="container">
            <div className={style.header__wrapper}>
                <img src={logo} alt="logo" className={style.logo} />
                <div className={style.search}>
                    <input className={style.search__input} autoComplete placeholder='Поиск по сайту' onFocus={(event) => { event.target.setAttribute('autocomplete', 'off')}}/>
                    <img src={search} alt='icon' className={style.search__icon}/>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header