import React from 'react'

import styles from './sliderButton.module.scss'

import arrowIcon from '../../resource/graphics/icons/sliderButton/arrow.svg'

function SliderButton(props) {
    const { className, style, onClick, } = props;
  return (
    <button onClick={onClick} className={`${className} ${styles.arrow}`}>
        <img src={arrowIcon} style={props.styling} alt="icon"/>
    </button>
  )
}

export default SliderButton