import React from 'react'

import style from './addProjectModalThird.module.scss'

function AddProjectModalThird() {
  return (
    <div className={style.AddProjectModalThird}>
        <div className={style.AddProjectModalThird__settings__wpapper}>

        <div className={style.AddProjectModalThird__settings}>
            <div className={style.AddProjectModalThird__settings__title}>
                Приватность
            </div>
            <div className={style.AddProjectModalThird__settings__select}>
            <input type="checkbox" name="" id="" className={style.AddProjectModalThird__settings__select__box}/> <span>Открытый проект</span>
            </div>
            <div className={style.AddProjectModalThird__settings__select}>
                <input type="checkbox" name="" id="" className={style.AddProjectModalThird__settings__select__box}/> <span>Приватный проект</span>
            </div>
        </div>
        <div className={style.AddProjectModalThird__settings}>
            <div className={style.AddProjectModalThird__settings__title}>Комментарии</div>
            <div className={style.AddProjectModalThird__settings__select}>
                <input type="checkbox" name="" id="" className={style.AddProjectModalThird__settings__select__box}/> <span>Разрешить</span>
            </div>
            <div className={style.AddProjectModalThird__settings__select}>
                <input type="checkbox" name="" id="" className={style.AddProjectModalThird__settings__select__box}/> <span>Запретить</span>
            </div>
        </div>
        </div>
        <div className={style.AddProjectModalThird__preview}>
            <div className={style.AddProjectModalThird__preview__title}>Предпросмотр</div>
            <div className={style.AddProjectModalThird__preview__canvas}>
                <div></div>
                <div className={style.block__previewText}>
                    <h2 className={style.block__previewTextTitle}></h2>
                    
                    <p className={style.block__previewTextDescr}></p>
                </div>
            </div>
        </div>
        <button className={style.AddProjectModalThird__button}>Опубликовать</button>
    </div>
    
  )
}

export default AddProjectModalThird