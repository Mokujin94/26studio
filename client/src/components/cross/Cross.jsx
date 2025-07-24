import { observer } from 'mobx-react-lite';
import style from './cross.module.scss'

const Cross = observer(({ onClick }) => {
	return (
		<div className={style.cross} onClick={onClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 22 22"
			>
				<path d="M1 11.0901H21Z" fill="#27323E" />
				<path
					d="M1 11.0901H21"
					stroke="#FCFCFC"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path d="M11 21L11 1Z" fill="#27323E" />
				<path
					d="M11 21L11 1"
					stroke="#FCFCFC"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
});

export default Cross;