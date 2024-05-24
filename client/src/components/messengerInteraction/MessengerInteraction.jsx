import React, { useContext, useEffect, useRef, useState } from 'react'
import io from 'socket.io-client';
import style from './messengerInteraction.module.scss'
import { useLocation, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { sendMessage } from '../../http/messengerAPI'
import EmojiPicker from 'emoji-picker-react';
const MessengerInteraction = observer(({ setMessages }) => {
	const [messageContent, setMessageContent] = useState('');
	const [notEmpty, setNotEmpty] = useState(false)
	const [showPicker, setShowPicker] = useState(false)

	const inputRef = useRef(null)

	const { user } = useContext(Context)
	const location = useLocation();

	const hash = Number(location.hash.replace("#", ""))

	const onSend = () => {
		if (messageContent.length <= 0) return;
		let message = {
			createdAt: Date.now(),
			text: messageContent,
			user: {
				avatar: user.user.avatar
			},
			userId: user.user.id
		}
		setMessageContent("");
		inputRef.current.innerText = '';
		// создать сообщение только у нас

		// 
		sendMessage(Number(hash), user.user.id, messageContent).then(data => {

			return data;
		}).then((data) => {
			if (user.user.id === hash) {
				user.socket.emit("sendMessageRecipient", { message: data, recipientId: hash })
				user.socket.emit("sendMessage", { message: data, recipientId: hash })
			} else {
				user.socket.emit("sendMessageRecipient", { message: data, recipientId: hash })
				user.socket.emit("sendMessageRecipient", { message: data, recipientId: user.user.id })
				user.socket.emit("sendMessage", { message: data, recipientId: hash })
			}
		});
	}

	const onEnter = (e) => {
		if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
			e.preventDefault(); // Предотвращает перевод строки
			onSend();
		}
	}

	const onInput = (e) => {
		const content = e.target.innerText;
		const formattedContent = content.trim();
		const filteredContent = formattedContent.normalize("NFD");

		setMessageContent(filteredContent)

		const regex = /<br>/g;
		const matches = e.target.innerHTML.match(regex);
		const hasLineBreaks = matches ? matches.length > 1 : false;

		// Проверяем, что filteredContent содержит символы, отличные от пробелов
		if (filteredContent.trim().length > 0 || hasLineBreaks) {
			setNotEmpty(true);
		} else {
			setNotEmpty(false);
		}
	}

	const handlePaste = (e) => {
		e.preventDefault();
		const text = (e.clipboardData || window.Clipboard).getData('text');
		document.execCommand('insertText', false, text);
	};

	const onEmojiClick = (emojiObject, event) => {
		console.log(inputRef.current);
		console.log(emojiObject);
		const img = <img scr={emojiObject.imageUrl} />
		console.log(img);
		inputRef.current.appendChild(img)
		setShowPicker(false);
		console.log(messageContent);
	};

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.addEventListener('paste', handlePaste);
		}

		return () => {
			if (inputRef.current) {
				inputRef.current.removeEventListener('paste', handlePaste);
			}
		};
	}, []);

	return (
		<div className={style.interaction}>
			<div className={style.interaction__clip}>
				<svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none">
					<path d="M5.07719 20C4.07331 19.9988 3.09226 19.6992 2.25774 19.139C1.42322 18.5787 0.772615 17.7829 0.387958 16.8519C0.00330138 15.9208 -0.0981788 14.8963 0.0963145 13.9075C0.290808 12.9186 0.772565 12.0097 1.48084 11.2954L8.25162 4.49715C8.82311 3.92468 9.59768 3.6036 10.4049 3.60454C11.2122 3.60549 11.986 3.92838 12.5562 4.50219C13.1263 5.076 13.4461 5.85371 13.4452 6.66425C13.4442 7.47479 13.1227 8.25176 12.5512 8.82423L5.5192 15.8847C5.42581 15.9793 5.3147 16.0543 5.19229 16.1055C5.06987 16.1567 4.93857 16.1831 4.80595 16.1831C4.67334 16.1831 4.54204 16.1567 4.41962 16.1055C4.2972 16.0543 4.1861 15.9793 4.09271 15.8847C3.90561 15.6958 3.80059 15.4401 3.80059 15.1736C3.80059 14.9072 3.90561 14.6515 4.09271 14.4625L11.1749 7.40204C11.3681 7.2081 11.4766 6.94505 11.4766 6.67077C11.4766 6.39649 11.3681 6.13345 11.1749 5.93951C10.9818 5.74556 10.7198 5.63661 10.4466 5.63661C10.1734 5.63661 9.91145 5.74556 9.71829 5.93951L2.90732 12.7277C2.33314 13.3062 2.01073 14.0896 2.01073 14.9064C2.01073 15.7231 2.33314 16.5065 2.90732 17.085C3.49328 17.6426 4.26987 17.9534 5.07719 17.9534C5.8845 17.9534 6.66109 17.6426 7.24705 17.085L13.7064 10.5994C14.6642 9.63775 15.2023 8.33341 15.2023 6.97337C15.2023 5.61332 14.6642 4.30899 13.7064 3.34729C12.7486 2.3856 11.4495 1.84532 10.095 1.84532C8.74045 1.84532 7.44139 2.3856 6.48358 3.34729L2.51554 7.33143C2.32371 7.52003 2.06512 7.62438 1.79666 7.62155C1.5282 7.61871 1.27186 7.50891 1.08403 7.3163C0.8962 7.1237 0.792264 6.86406 0.79509 6.59451C0.797916 6.32496 0.907272 6.06758 1.0991 5.87899L5.11737 1.84441C6.47063 0.615756 8.24239 -0.0437542 10.0663 0.00225506C11.8902 0.0482643 13.6267 0.796274 14.9168 2.09161C16.2069 3.38695 16.9519 5.13054 16.9978 6.96184C17.0436 8.79315 16.3867 10.5721 15.163 11.9309L8.70367 18.4164C8.23737 18.913 7.67553 19.3094 7.05218 19.5816C6.42882 19.8538 5.75693 19.9962 5.07719 20Z" fill="#FCFCFC" />
				</svg>
			</div>
			<div className={style.interaction__input} onInput={onInput} onKeyDown={onEnter} contentEditable ref={inputRef}>{messageContent}</div>
			<img
				className="emoji-icon"
				src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
				onClick={() => setShowPicker((val) => !val)}
			/>
			{showPicker && (
				<EmojiPicker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
			)}
			<div className={style.interaction__send} onClick={onSend}>
				<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
					<path d="M9.05317 9.00264H2.90136M2.72699 9.83037L1.71063 12.9467C1.15398 14.6534 0.875649 15.5068 1.07539 16.0323C1.24884 16.4887 1.62138 16.8347 2.08108 16.9664C2.61043 17.118 3.40996 16.7487 5.00901 16.0102L15.2604 11.275C16.8212 10.5541 17.6017 10.1937 17.8428 9.6929C18.0524 9.25785 18.0524 8.74733 17.8428 8.31228C17.6017 7.81162 16.8212 7.45113 15.2604 6.73019L4.99133 1.98695C3.39709 1.25058 2.59998 0.882393 2.07116 1.03343C1.61189 1.1646 1.23939 1.50968 1.06533 1.9652C0.864906 2.48974 1.14026 3.34127 1.69098 5.04434L2.72897 8.25435C2.82354 8.54683 2.87084 8.69313 2.88951 8.84264C2.90608 8.97544 2.9059 9.10979 2.88901 9.24249C2.86996 9.392 2.82231 9.53809 2.72699 9.83037Z" stroke="#97BCE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</div>
	)
})

export default MessengerInteraction