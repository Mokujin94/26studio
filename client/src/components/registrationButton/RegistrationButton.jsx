import React from 'react';

import style from './registrationButton.module.scss';

function RegistrationButton({ children, setStages }) {
  return (
    <button className={style.button} onClick={() => setStages((item) => item + 1)}>
      {children}
    </button>
  );
}

export default RegistrationButton;
