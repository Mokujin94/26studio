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
    <select className={style.filter__item}>
        <option value="" selected>Сортировка</option>
        {filterItem}
    </select>
  )
}

export default ProjectFilter