import React from "react";

import styles from "./sliderButton.module.scss";

import arrowIcon from "../../resource/graphics/icons/sliderButton/arrow.svg";

function SliderButton(props) {
  const { className, style, onClick } = props;
  return (
    <button onClick={onClick} className={`${className} ${styles.arrow}`}>
      <svg
        className={styles.arrow__item}
        style={props.styling}
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
    </button>
  );
}

export default SliderButton;
