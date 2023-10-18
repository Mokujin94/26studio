import React from 'react';

import style from './functionButton.module.scss';

function FunctionButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={style.button}>
      {children}
    </button>
  );
}

export default FunctionButton;
