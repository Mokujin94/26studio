import React from 'react'

import style from "./footer.module.scss"

import logo from "../../resource/graphics/icons/footer/footer_logo.svg"
import tg from "../../resource/graphics/icons/footer/footer_icon_tg.svg"
import vk from "../../resource/graphics/icons/footer/footer_icon_vk.svg"


function Footer() {
  return (
    <div className={style.footer}>
        <img src={logo} alt="" className={style.footer__logo} />
        <div className={style.footer__text}>
            <a href='' className={style.footer__textContact}>
                Контакты
            </a>
            <a href='' className={style.footer__textPolicy}>
                Политика конфидециальности
            </a>
        </div>
        <div className={style.footer__links}>
            <a href="" className={style.footer__link}>
                <img src={tg} alt="" className={style.footer__linkItem} />
            </a>
            <a href="" className={style.footer__link}>
                <img src={vk} alt="" className={style.footer__linkItem} />
            </a>
        </div>
    </div>
  )
}

export default Footer