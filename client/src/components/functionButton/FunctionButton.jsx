import React from 'react';

import style from './functionButton.module.scss';

function FunctionButton({ children, onClick, disabled }) {
	return (
		<button onClick={onClick} className={style.button} disabled={disabled}>
			{children}
		</button>
	);
}

export default FunctionButton;
