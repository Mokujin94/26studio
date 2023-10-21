import React, { useState } from 'react'
import style from './projectFilter.module.scss'



function ProjectFilter() {
    const [selected, setSelected] = useState(0)

    const filterItems = [
        {title: 'Все проекты'},
        {title: 'По лайкам'},
        {title: 'По просмотрам'},
        {title: 'По дате'}
    ]

    const filterItem = filterItems.map(({title}, i) => {
        return (
            <option className={style.filter__item} key={i}>{title}</option>
        )
    })

  return (
    <div className={style.block}>
        <select className={style.filter}>
            <option value="" className={style.filter__item} disabled >Сортировка</option>
            {filterItem}
        </select>
        <svg
            className={style.block__arrow}
            width="11"
            height="22"
            viewBox="0 0 11 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
            d="M1 21L9.2677 12.7677C10.2441 11.7955 10.2441 10.2045 9.2677 9.23232L1 1"
            stroke="#72FFF7"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
            />
        </svg>
    </div>
  )
}

export default ProjectFilter