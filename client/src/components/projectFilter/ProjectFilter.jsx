import React, { useState } from 'react'
import style from './projectFilter.module.scss'


function ProjectFilter() {



    const filterItems = [
        {title: 'Все проекты'},
        {title: 'По лайкам'},
        {title: 'По просмотрам'},
        {title: 'По дате'}
    ]

    const [selected, setSelected] = useState(0)

    const changeSelected = (i) => {
        setSelected(i)
    }

    const filterItem = filterItems.map(({title}, i) => {
        return (
            <div onClick={() => changeSelected(i)} className={selected === i ? `${style.filter__item} ${style.filter__selected}` : style.filter__item} key={i}>{title}</div>
        )
    })

  return (
    <div className={style.filter}>
        <div className={style.title}>Сортировка по:</div>
        <div className={style.filter__inner}>
            {filterItem}
        </div>
    </div>
  )
}

export default ProjectFilter