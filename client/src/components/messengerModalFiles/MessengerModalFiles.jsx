import { useEffect, useRef } from 'react';
import style from './messengerModalFiles.module.scss'
import FunctionButton from '../functionButton/FunctionButton';
import Cross from '../cross/Cross';

const MessengerModalFiles = ({ setIsModal }) => {

	const photos = [
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
		{ img: "https://static-cse.canva.com/blob/846900/photo1502082553048f009c37129b9e1583341920812.jpeg" },
	]

	const photoBlockRef = useRef(null);

	useEffect(() => {
		const photoGrid = photoBlockRef.current;
		const photoItems = photoGrid.querySelectorAll(`.${style.block__img}`);
		photoItems.forEach(element => {
			element.style.removeProperty("grid-column")
		});
		if (photos.length < 6 && photos.length % 2 === 1) {
			photoItems[0].style.gridColumn = "1 / -1"
		}

		if (photos.length >= 6) {
			if (photos.length % 2 === 0) {
				photoItems[0].style.gridColumn = "1 / -1"
				photoItems[photoItems.length - 1].style.gridColumn = "1 / -1"
			}
			if (photos.length % 2 === 1) {
				photoItems[0].style.gridColumn = "1 / -1"
				photoItems[photoItems.length - 1].style.gridColumn = "1 / -1"
				if (Math.ceil(photoItems.length / 2) % 2 === 0) {
					photoItems[Math.ceil(photoItems.length / 2) - 1].style.gridColumn = "1 / -1"
				} else {
					photoItems[Math.floor(photoItems.length / 2) - 1].style.gridColumn = "1 / -1"

				}
			}
		}
	}, [photos]);
	return (
		<div ref={photoBlockRef} className={style.block}>
			<div className={style.block__header}>
				<Cross onClick={() => setIsModal(false)} />


				<h3 className={style.block__headerCount}>Добавлено {photos.length} фото</h3>
				<label htmlFor='addFile' className={style.block__headerBtn}>
					<input type="file" id='addFile' name='addFile' />
					<div className={style.block__headerBtnWrapper}>
						<div className={style.block__headerBtnInner}>
							<div className={style.block__headerBtnInnerIcon}>
								<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.1" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#323232"></path> <path d="M9 12H15" stroke="#323232" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 9L12 15" stroke="#323232" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#323232" strokeWidth="2"></path> </g></svg>
							</div>
							<span>Добавить</span>
						</div>
					</div>
				</label>
			</div>
			<div className={style.block__wrapper}>
				{photos.map((item, i) => {
					return (
						<div key={i} className={style.block__img}>
							<img src={item.img} alt="" />
						</div>
					)
				})}
			</div>
		</div>
	);
};

export default MessengerModalFiles;