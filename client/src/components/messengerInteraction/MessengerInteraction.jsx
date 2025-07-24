import React, { useContext, useEffect, useRef, useState } from 'react'
import io from 'socket.io-client';
import style from './messengerInteraction.module.scss'
import { useLocation, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { fetchPersonalChat, sendMessage } from '../../http/messengerAPI'
import EmojiPicker from 'emoji-picker-react';
import { useDebounce } from '../../hooks/useDebounce';
import { checkDraft } from '../../http/draftAPI';
const MessengerInteraction = observer(({ chatData, setMessages, isScrollBottom, windowChatRef, setChatData, setChats, replyMessage, setReplyMessage, inputRef, setFiles, files }) => {
	const [messageContent, setMessageContent] = useState('');
	const [messageContentFull, setMessageContentFull] = useState('')
	const [notEmpty, setNotEmpty] = useState(false)
	const [showPicker, setShowPicker] = useState(false)


	const emojiRef = useRef(null)

	const { user } = useContext(Context)
	const location = useLocation();

	const hash = Number(location.hash.replace("#", ""))

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			if (chatData.drafts?.length) {
				inputRef.current.innerText = chatData.drafts[0].text;
				setMessageContent(chatData.drafts[0].text)
			} else {
				inputRef.current.innerText = '';
				// setMessageContent('')
			}
			const range = document.createRange();
			range.selectNodeContents(inputRef.current);
			range.collapse(false);
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
		return () => {
			if (inputRef.current && chatData.id) {
				const filter = inputRef.current.innerText.trim().normalize("NFD");

				checkDraft(user.user.id, chatData.id, filter)
				user.socket.emit("onDraft", ({ text: filter, recipientId: user.user.id, chatId: chatData.id }))
			}
			user.socket.emit("onWriting", ({ chatId: chatData.id, recipientId: hash, isWriting: false }))
		}
	}, [chatData])

	useEffect(() => {
		if (!chatData.id) return;
		const timerWriting = setTimeout(() => {
			user.socket.emit("onWriting", ({ chatId: chatData.id, recipientId: hash, isWriting: false }))
		}, 500);
		const timerDraft = setTimeout(() => {
			checkDraft(user.user.id, chatData.id, messageContent)
			user.socket.emit("onDraft", ({ text: messageContent, recipientId: user.user.id, chatId: chatData.id }))
		}, 3000);
		return () => {
			clearTimeout(timerWriting)
			clearTimeout(timerDraft)
		}
	}, [messageContent])

	const isDifferentDay = (date1, date2) => {
		return date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear() &&
			date1.getHours() === date2.getHours();
	};

	const onSend = () => {
		if (messageContent.length <= 0) return;
		if (replyMessage.id !== null) {
			setReplyMessage(prev => {
				return { ...prev, id: null }
			})
		}
		let message = {
			id: Date.now(),
			createdAt: Date.now(),
			text: messageContent,
			load: true,
			user: {
				avatar: user.user.avatar,
				id: user.user.id,
			},
			userId: user.user.id,
		}
		setMessageContent("");
		inputRef.current.innerText = '';
		// создать сообщение только у нас
		setMessages((prevMessages) => {
			const lastGroup = prevMessages[prevMessages.length - 1];

			if (lastGroup && !isDifferentDay(new Date(lastGroup[lastGroup.length - 1].createdAt), new Date(message.createdAt))) {
				// Создаем новую группу, если сообщение написанно в другом часу или в другой день

				return [...prevMessages, [message]];
			}

			if (lastGroup && lastGroup[0].userId === message.userId) {
				// Добавляем в конец последней группы, если это от того же пользователя

				return [...prevMessages.slice(0, prevMessages.length - 1), [...lastGroup, message]];
			} else {
				// Создаем новую группу, если это другой пользователь

				return [...prevMessages, [message]];
			}
		});

		// 

		// Прокрутка вниз после отправки фейкового сообщения

		if (isScrollBottom) {
			setTimeout(() => {
				if (windowChatRef.current)
					windowChatRef.current.scrollTo({
						top: windowChatRef.current.scrollHeight,
						behavior: "smooth",
					});
			}, 0)

		}

		//

		sendMessage(Number(hash), user.user.id, messageContent).then(async data => {
			if (!chatData.id && data.userId == user.user.id) {
				await fetchPersonalChat(hash, user.user.id).then(data => {
					setChats(prevChats => {
						return [...prevChats, data]
					})
					setChatData(prevChatData => {
						return { ...prevChatData, ...data }
					})
				})
			}
			return data;
		}).then((data) => {
			if (user.user.id === hash) {
				user.socket.emit("sendMessage", { message: data, recipientId: hash })
				// user.socket.emit("sendMessageRecipient", { message: data, recipientId: hash })
			} else {
				user.socket.emit("sendMessageRecipient", { message: data, recipientId: hash })
				// user.socket.emit("sendMessageRecipient", { message: data, recipientId: user.user.id })
				user.socket.emit("sendMessage", { message: data, recipientId: hash })
			}
			return data;
		}).then(data => {
			setMessages(prevMessages => {
				return prevMessages.map(group => {
					return group.map(oldMessage => {
						if (oldMessage.id === message.id) {
							// console.log(oldMessage)
							return { ...oldMessage, load: false, ...data }
						}
						return oldMessage;
					})
				})
			})
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
		const lastSymbol = content.slice(content.length - 1, content.length)
		console.log(lastSymbol == " ");
		setMessageContentFull(content)
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

		if (lastSymbol != ' ' && lastSymbol != '') {
			user.socket.emit("onWriting", ({ chatId: chatData.id, recipientId: hash, isWriting: true }))
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
			<label htmlFor='clip' className={style.interaction__clip}>
				<input value={files} id='clip' name='clip' type="file" onClick={(e) => setFiles(e.target.files[0])} />
				<svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none">
					<path d="M5.07719 20C4.07331 19.9988 3.09226 19.6992 2.25774 19.139C1.42322 18.5787 0.772615 17.7829 0.387958 16.8519C0.00330138 15.9208 -0.0981788 14.8963 0.0963145 13.9075C0.290808 12.9186 0.772565 12.0097 1.48084 11.2954L8.25162 4.49715C8.82311 3.92468 9.59768 3.6036 10.4049 3.60454C11.2122 3.60549 11.986 3.92838 12.5562 4.50219C13.1263 5.076 13.4461 5.85371 13.4452 6.66425C13.4442 7.47479 13.1227 8.25176 12.5512 8.82423L5.5192 15.8847C5.42581 15.9793 5.3147 16.0543 5.19229 16.1055C5.06987 16.1567 4.93857 16.1831 4.80595 16.1831C4.67334 16.1831 4.54204 16.1567 4.41962 16.1055C4.2972 16.0543 4.1861 15.9793 4.09271 15.8847C3.90561 15.6958 3.80059 15.4401 3.80059 15.1736C3.80059 14.9072 3.90561 14.6515 4.09271 14.4625L11.1749 7.40204C11.3681 7.2081 11.4766 6.94505 11.4766 6.67077C11.4766 6.39649 11.3681 6.13345 11.1749 5.93951C10.9818 5.74556 10.7198 5.63661 10.4466 5.63661C10.1734 5.63661 9.91145 5.74556 9.71829 5.93951L2.90732 12.7277C2.33314 13.3062 2.01073 14.0896 2.01073 14.9064C2.01073 15.7231 2.33314 16.5065 2.90732 17.085C3.49328 17.6426 4.26987 17.9534 5.07719 17.9534C5.8845 17.9534 6.66109 17.6426 7.24705 17.085L13.7064 10.5994C14.6642 9.63775 15.2023 8.33341 15.2023 6.97337C15.2023 5.61332 14.6642 4.30899 13.7064 3.34729C12.7486 2.3856 11.4495 1.84532 10.095 1.84532C8.74045 1.84532 7.44139 2.3856 6.48358 3.34729L2.51554 7.33143C2.32371 7.52003 2.06512 7.62438 1.79666 7.62155C1.5282 7.61871 1.27186 7.50891 1.08403 7.3163C0.8962 7.1237 0.792264 6.86406 0.79509 6.59451C0.797916 6.32496 0.907272 6.06758 1.0991 5.87899L5.11737 1.84441C6.47063 0.615756 8.24239 -0.0437542 10.0663 0.00225506C11.8902 0.0482643 13.6267 0.796274 14.9168 2.09161C16.2069 3.38695 16.9519 5.13054 16.9978 6.96184C17.0436 8.79315 16.3867 10.5721 15.163 11.9309L8.70367 18.4164C8.23737 18.913 7.67553 19.3094 7.05218 19.5816C6.42882 19.8538 5.75693 19.9962 5.07719 20Z" fill="#FCFCFC" />
				</svg>
			</label>
			<div className={style.interaction__input} onInput={onInput} onKeyDown={onEnter} contentEditable ref={inputRef}></div>
			<div className={style.interaction__emoji}>
				{/* <div className={style.interaction__emoji_picker} ref={emojiRef}>
					<EmojiPicker />
				</div> */}
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z" fill="#0F0F0F"></path> <path d="M17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z" fill="#0F0F0F"></path> <path d="M8.88875 13.5414C8.63822 13.0559 8.0431 12.8607 7.55301 13.1058C7.05903 13.3528 6.8588 13.9535 7.10579 14.4474C7.18825 14.6118 7.29326 14.7659 7.40334 14.9127C7.58615 15.1565 7.8621 15.4704 8.25052 15.7811C9.04005 16.4127 10.2573 17.0002 12.0002 17.0002C13.7431 17.0002 14.9604 16.4127 15.7499 15.7811C16.1383 15.4704 16.4143 15.1565 16.5971 14.9127C16.7076 14.7654 16.8081 14.6113 16.8941 14.4485C17.1387 13.961 16.9352 13.3497 16.4474 13.1058C15.9573 12.8607 15.3622 13.0559 15.1117 13.5414C15.0979 13.5663 14.9097 13.892 14.5005 14.2194C14.0401 14.5877 13.2573 15.0002 12.0002 15.0002C10.7431 15.0002 9.96038 14.5877 9.49991 14.2194C9.09071 13.892 8.90255 13.5663 8.88875 13.5414Z" fill="#0F0F0F"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 20.9932C7.03321 20.9932 3.00683 16.9668 3.00683 12C3.00683 7.03321 7.03321 3.00683 12 3.00683C16.9668 3.00683 20.9932 7.03321 20.9932 12C20.9932 16.9668 16.9668 20.9932 12 20.9932Z" fill="#0F0F0F"></path> </g></svg>
			</div>
			<div className={style.interaction__send} onClick={onSend}>
				<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
					<path d="M9.05317 9.00264H2.90136M2.72699 9.83037L1.71063 12.9467C1.15398 14.6534 0.875649 15.5068 1.07539 16.0323C1.24884 16.4887 1.62138 16.8347 2.08108 16.9664C2.61043 17.118 3.40996 16.7487 5.00901 16.0102L15.2604 11.275C16.8212 10.5541 17.6017 10.1937 17.8428 9.6929C18.0524 9.25785 18.0524 8.74733 17.8428 8.31228C17.6017 7.81162 16.8212 7.45113 15.2604 6.73019L4.99133 1.98695C3.39709 1.25058 2.59998 0.882393 2.07116 1.03343C1.61189 1.1646 1.23939 1.50968 1.06533 1.9652C0.864906 2.48974 1.14026 3.34127 1.69098 5.04434L2.72897 8.25435C2.82354 8.54683 2.87084 8.69313 2.88951 8.84264C2.90608 8.97544 2.9059 9.10979 2.88901 9.24249C2.86996 9.392 2.82231 9.53809 2.72699 9.83037Z" stroke="#97BCE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</div>
	)
})

export default MessengerInteraction