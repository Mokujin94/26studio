import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import style from "./messengerInteraction.module.scss";
import { useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { fetchPersonalChat, sendMessage } from "../../http/messengerAPI";
import EmojiPicker from "emoji-picker-react";
import { useDebounce } from "../../hooks/useDebounce";
import { checkDraft } from "../../http/draftAPI";
import StickerPicker from "../stickerPicker/StickerPicker";
const MessengerInteraction = observer(
	({
		chatData,
		setMessages,
		isScrollBottom,
		windowChatRef,
		setChatData,
		setChats,
		replyMessage,
		setReplyMessage,
		inputRef,
		setFiles,
		files,
		setIsModal,
	}) => {
		const [messageContent, setMessageContent] = useState("");
		const [messageContentFull, setMessageContentFull] = useState("");
		const [notEmpty, setNotEmpty] = useState(false);
		const [showPicker, setShowPicker] = useState(false);
		const [showStickerPicker, setShowStickerPicker] = useState(false);

		const fileInputRef = useRef(null);
		const emojiRef = useRef(null);
		const emojiPickerRef = useRef(null);
		const stickerRef = useRef(null);
		const stickerPickerRef = useRef(null);

		const { user } = useContext(Context);
		const location = useLocation();

		const hash = Number(location.hash.replace("#", ""));

		useEffect(() => {
			if (inputRef.current) {
				inputRef.current.focus();
				if (chatData.drafts?.length) {
					inputRef.current.innerText = chatData.drafts[0].text;
					setMessageContent(chatData.drafts[0].text);
				} else {
					inputRef.current.innerText = "";
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

					checkDraft(user.user.id, chatData.id, filter);
					user.socket.emit("onDraft", {
						text: filter,
						recipientId: user.user.id,
						chatId: chatData.id,
					});
				}
				user.socket.emit("onWriting", {
					chatId: chatData.id,
					recipientId: hash,
					isWriting: false,
				});
			};
		}, [chatData]);

		useEffect(() => {
			if (!chatData.id) return;
			const timerWriting = setTimeout(() => {
				user.socket.emit("onWriting", {
					chatId: chatData.id,
					recipientId: hash,
					isWriting: false,
				});
			}, 500);
			const timerDraft = setTimeout(() => {
				checkDraft(user.user.id, chatData.id, messageContent);
				user.socket.emit("onDraft", {
					text: messageContent,
					recipientId: user.user.id,
					chatId: chatData.id,
				});
			}, 3000);
			return () => {
				clearTimeout(timerWriting);
				clearTimeout(timerDraft);
			};
		}, [messageContent]);

		const isDifferentDay = (date1, date2) => {
			return (
				date1.getDate() === date2.getDate() &&
				date1.getMonth() === date2.getMonth() &&
				date1.getFullYear() === date2.getFullYear() &&
				date1.getHours() === date2.getHours()
			);
		};

		const onSend = () => {
			if (messageContent.length <= 0) return;
			const replyId = replyMessage.id;
			const replyData =
				replyId !== null
					? {
							id: replyId,
							text: replyMessage.text,
							user: { name: replyMessage.userName },
					  }
					: null;
			if (replyMessage.id !== null) {
				setReplyMessage((prev) => ({ ...prev, id: null }));
			}
			let message = {
				id: Date.now(),
				createdAt: Date.now(),
				text: messageContent,
				replyMessage: replyData,
				load: true,
				user: {
					avatar: user.user.avatar,
					id: user.user.id,
				},
				userId: user.user.id,
			};
			setMessageContent("");
			inputRef.current.innerText = "";
			// создать сообщение только у нас
			setMessages((prevMessages) => {
				const lastGroup = prevMessages[prevMessages.length - 1];

				if (
					lastGroup &&
					!isDifferentDay(
						new Date(lastGroup[lastGroup.length - 1].createdAt),
						new Date(message.createdAt)
					)
				) {
					// Создаем новую группу, если сообщение написанно в другом часу или в другой день

					return [...prevMessages, [message]];
				}

				if (lastGroup && lastGroup[0].userId === message.userId) {
					// Добавляем в конец последней группы, если это от того же пользователя

					return [
						...prevMessages.slice(0, prevMessages.length - 1),
						[...lastGroup, message],
					];
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
				}, 0);
			}

			//

			sendMessage(Number(hash), user.user.id, messageContent, [], replyId)
				.then(async (data) => {
					if (!chatData.id && data.userId == user.user.id) {
						await fetchPersonalChat(hash, user.user.id).then((data) => {
							setChats((prevChats) => {
								return [...prevChats, data];
							});
							setChatData((prevChatData) => {
								return { ...prevChatData, ...data };
							});
						});
					}
					return data;
				})
				.then((data) => {
					if (user.user.id === hash) {
						user.socket.emit("sendMessage", {
							message: data,
							recipientId: hash,
						});
						// user.socket.emit("sendMessageRecipient", { message: data, recipientId: hash })
					} else {
						user.socket.emit("sendMessageRecipient", {
							message: data,
							recipientId: hash,
						});
						// user.socket.emit("sendMessageRecipient", { message: data, recipientId: user.user.id })
						user.socket.emit("sendMessage", {
							message: data,
							recipientId: hash,
						});
					}
					return data;
				})
				.then((data) => {
					setMessages((prevMessages) => {
						return prevMessages.map((group) => {
							return group.map((oldMessage) => {
								if (oldMessage.id === message.id) {
									// console.log(oldMessage)
									return { ...oldMessage, load: false, ...data };
								}
								return oldMessage;
							});
						});
					});
				});
		};

		const onEnter = (e) => {
			if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
				e.preventDefault(); // Предотвращает перевод строки
				onSend();
			}
		};

		const onInput = (e) => {
			const content = e.target.innerText;
			const formattedContent = content.trim();
			const filteredContent = formattedContent.normalize("NFD");
			const lastSymbol = content.slice(content.length - 1, content.length);
			console.log(lastSymbol == " ");
			setMessageContentFull(content);
			setMessageContent(filteredContent);

			const regex = /<br>/g;
			const matches = e.target.innerHTML.match(regex);
			const hasLineBreaks = matches ? matches.length > 1 : false;

			// Проверяем, что filteredContent содержит символы, отличные от пробелов
			if (filteredContent.trim().length > 0 || hasLineBreaks) {
				setNotEmpty(true);
			} else {
				setNotEmpty(false);
			}

			if (lastSymbol != " " && lastSymbol != "") {
				user.socket.emit("onWriting", {
					chatId: chatData.id,
					recipientId: hash,
					isWriting: true,
				});
			}
		};

		const handlePaste = (e) => {
			// Проверяем наличие изображений в буфере обмена
			const items = e.clipboardData?.items;
			if (items) {
				const imageItems = [];
				for (let i = 0; i < items.length; i++) {
					if (items[i].type.startsWith("image/")) {
						const file = items[i].getAsFile();
						if (file) {
							imageItems.push(file);
						}
					}
				}
				if (imageItems.length > 0) {
					e.preventDefault();
					setFiles(imageItems);
					setIsModal(true);
					return;
				}
			}

			// Если нет изображений, вставляем текст
			e.preventDefault();
			const text = (e.clipboardData || window.Clipboard).getData("text");
			document.execCommand("insertText", false, text);
		};

		const onEmojiClick = (emojiData) => {
			// Вставляем emoji в поле ввода
			if (inputRef.current) {
				inputRef.current.innerText += emojiData.emoji;
				setMessageContent((prev) => prev + emojiData.emoji);

				// Ставим курсор в конец
				const range = document.createRange();
				range.selectNodeContents(inputRef.current);
				range.collapse(false);
				const sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
				inputRef.current.focus();
			}
			setShowPicker(false);
		};

		// Отправка стикера как сообщения
		const onStickerSelect = (sticker) => {
			const replyId = replyMessage.id;
			const replyData =
				replyId !== null
					? {
							id: replyId,
							text: replyMessage.text,
							user: { name: replyMessage.userName },
					  }
					: null;
			if (replyMessage.id !== null) {
				setReplyMessage((prev) => ({ ...prev, id: null }));
			}

			// Формируем текст стикера (используем специальный формат)
			const stickerText =
				sticker.type === "emoji"
					? `[sticker:emoji:${sticker.emoji}]`
					: `[sticker:image:${sticker.url}]`;

			let message = {
				id: Date.now(),
				createdAt: Date.now(),
				text: stickerText,
				isSticker: true,
				stickerData: sticker,
				replyMessage: replyData,
				load: true,
				user: {
					avatar: user.user.avatar,
					id: user.user.id,
				},
				userId: user.user.id,
			};

			// Создать сообщение только у нас
			setMessages((prevMessages) => {
				const lastGroup = prevMessages[prevMessages.length - 1];

				if (
					lastGroup &&
					!isDifferentDay(
						new Date(lastGroup[lastGroup.length - 1].createdAt),
						new Date(message.createdAt)
					)
				) {
					return [...prevMessages, [message]];
				}

				if (lastGroup && lastGroup[0].userId === message.userId) {
					return [
						...prevMessages.slice(0, prevMessages.length - 1),
						[...lastGroup, message],
					];
				} else {
					return [...prevMessages, [message]];
				}
			});

			// Прокрутка вниз
			if (isScrollBottom) {
				setTimeout(() => {
					if (windowChatRef.current)
						windowChatRef.current.scrollTo({
							top: windowChatRef.current.scrollHeight,
							behavior: "smooth",
						});
				}, 0);
			}

			// Отправка на сервер
			sendMessage(Number(hash), user.user.id, stickerText, [], replyId)
				.then(async (data) => {
					if (!chatData.id && data.userId == user.user.id) {
						await fetchPersonalChat(hash, user.user.id).then((data) => {
							setChats((prevChats) => {
								return [...prevChats, data];
							});
							setChatData((prevChatData) => {
								return { ...prevChatData, ...data };
							});
						});
					}
					return data;
				})
				.then((data) => {
					if (user.user.id === hash) {
						user.socket.emit("sendMessage", {
							message: data,
							recipientId: hash,
						});
					} else {
						user.socket.emit("sendMessageRecipient", {
							message: data,
							recipientId: hash,
						});
						user.socket.emit("sendMessage", {
							message: data,
							recipientId: hash,
						});
					}
					return data;
				})
				.then((data) => {
					setMessages((prevMessages) => {
						return prevMessages.map((group) => {
							return group.map((oldMessage) => {
								if (oldMessage.id === message.id) {
									return { ...oldMessage, load: false, ...data };
								}
								return oldMessage;
							});
						});
					});
				});

			setShowStickerPicker(false);
		};

		// Закрытие emoji picker при клике вне его
		useEffect(() => {
			const handleClickOutside = (e) => {
				const isInsideEmojiButton =
					emojiRef.current && emojiRef.current.contains(e.target);
				const isInsidePicker =
					emojiPickerRef.current && emojiPickerRef.current.contains(e.target);
				// Также проверяем, не кликнули ли на элемент EmojiPicker (он может создавать порталы)
				const isEmojiPickerElement = e.target.closest(".EmojiPickerReact");

				if (!isInsideEmojiButton && !isInsidePicker && !isEmojiPickerElement) {
					setShowPicker(false);
				}
			};

			if (showPicker) {
				// Используем setTimeout чтобы избежать немедленного срабатывания на тот же клик
				const timeoutId = setTimeout(() => {
					document.addEventListener("mousedown", handleClickOutside);
				}, 0);

				return () => {
					clearTimeout(timeoutId);
					document.removeEventListener("mousedown", handleClickOutside);
				};
			}
		}, [showPicker]);

		// Закрытие sticker picker при клике вне его
		useEffect(() => {
			const handleClickOutside = (e) => {
				const isInsideStickerButton =
					stickerRef.current && stickerRef.current.contains(e.target);
				const isInsidePicker =
					stickerPickerRef.current &&
					stickerPickerRef.current.contains(e.target);

				if (!isInsideStickerButton && !isInsidePicker) {
					setShowStickerPicker(false);
				}
			};

			if (showStickerPicker) {
				const timeoutId = setTimeout(() => {
					document.addEventListener("mousedown", handleClickOutside);
				}, 0);

				return () => {
					clearTimeout(timeoutId);
					document.removeEventListener("mousedown", handleClickOutside);
				};
			}
		}, [showStickerPicker]);

		useEffect(() => {
			if (inputRef.current) {
				inputRef.current.addEventListener("paste", handlePaste);
			}

			return () => {
				if (inputRef.current) {
					inputRef.current.removeEventListener("paste", handlePaste);
				}
			};
		}, []);

		const handleFileSelect = (e) => {
			const selected = Array.from(e.target.files);
			if (selected.length) {
				// Фильтруем только изображения
				const imageFiles = selected.filter((file) =>
					file.type.startsWith("image/")
				);
				if (imageFiles.length) {
					setFiles(imageFiles);
					setIsModal(true);
				}
			}
			// Сбрасываем значение input чтобы можно было выбрать тот же файл снова
			e.target.value = "";
		};

		const handleClipClick = () => {
			fileInputRef.current?.click();
		};

		return (
			<div className={style.interaction}>
				<input
					type="file"
					ref={fileInputRef}
					style={{ display: "none" }}
					multiple
					accept="image/*"
					onChange={handleFileSelect}
				/>

				<label className={style.interaction__clip} onClick={handleClipClick}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="17"
						height="20"
						viewBox="0 0 17 20"
						fill="none"
					>
						<path
							d="M5.07719 20C4.07331 19.9988 3.09226 19.6992 2.25774 19.139C1.42322 18.5787 0.772615 17.7829 0.387958 16.8519C0.00330138 15.9208 -0.0981788 14.8963 0.0963145 13.9075C0.290808 12.9186 0.772565 12.0097 1.48084 11.2954L8.25162 4.49715C8.82311 3.92468 9.59768 3.6036 10.4049 3.60454C11.2122 3.60549 11.986 3.92838 12.5562 4.50219C13.1263 5.076 13.4461 5.85371 13.4452 6.66425C13.4442 7.47479 13.1227 8.25176 12.5512 8.82423L5.5192 15.8847C5.42581 15.9793 5.3147 16.0543 5.19229 16.1055C5.06987 16.1567 4.93857 16.1831 4.80595 16.1831C4.67334 16.1831 4.54204 16.1567 4.41962 16.1055C4.2972 16.0543 4.1861 15.9793 4.09271 15.8847C3.90561 15.6958 3.80059 15.4401 3.80059 15.1736C3.80059 14.9072 3.90561 14.6515 4.09271 14.4625L11.1749 7.40204C11.3681 7.2081 11.4766 6.94505 11.4766 6.67077C11.4766 6.39649 11.3681 6.13345 11.1749 5.93951C10.9818 5.74556 10.7198 5.63661 10.4466 5.63661C10.1734 5.63661 9.91145 5.74556 9.71829 5.93951L2.90732 12.7277C2.33314 13.3062 2.01073 14.0896 2.01073 14.9064C2.01073 15.7231 2.33314 16.5065 2.90732 17.085C3.49328 17.6426 4.26987 17.9534 5.07719 17.9534C5.8845 17.9534 6.66109 17.6426 7.24705 17.085L13.7064 10.5994C14.6642 9.63775 15.2023 8.33341 15.2023 6.97337C15.2023 5.61332 14.6642 4.30899 13.7064 3.34729C12.7486 2.3856 11.4495 1.84532 10.095 1.84532C8.74045 1.84532 7.44139 2.3856 6.48358 3.34729L2.51554 7.33143C2.32371 7.52003 2.06512 7.62438 1.79666 7.62155C1.5282 7.61871 1.27186 7.50891 1.08403 7.3163C0.8962 7.1237 0.792264 6.86406 0.79509 6.59451C0.797916 6.32496 0.907272 6.06758 1.0991 5.87899L5.11737 1.84441C6.47063 0.615756 8.24239 -0.0437542 10.0663 0.00225506C11.8902 0.0482643 13.6267 0.796274 14.9168 2.09161C16.2069 3.38695 16.9519 5.13054 16.9978 6.96184C17.0436 8.79315 16.3867 10.5721 15.163 11.9309L8.70367 18.4164C8.23737 18.913 7.67553 19.3094 7.05218 19.5816C6.42882 19.8538 5.75693 19.9962 5.07719 20Z"
							fill="#FCFCFC"
						/>
					</svg>
				</label>
				<div
					className={style.interaction__input}
					onInput={onInput}
					onKeyDown={onEnter}
					contentEditable
					ref={inputRef}
				></div>
				{/* Кнопка стикеров */}
				<div className={style.interaction__sticker} ref={stickerRef}>
					<div
						className={style.interaction__stickerButton}
						onClick={() => {
							setShowStickerPicker((prev) => !prev);
							setShowPicker(false);
						}}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
								stroke="#FCFCFC"
								strokeWidth="1.5"
							/>
							<path
								d="M8.5 12.5C8.5 12.5 9.5 14 12 14C14.5 14 15.5 12.5 15.5 12.5"
								stroke="#FCFCFC"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
							<path
								d="M8.5 9V9.01"
								stroke="#FCFCFC"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<path
								d="M15.5 9V9.01"
								stroke="#FCFCFC"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<path
								d="M22 12C22 12 19 16 19 19C19 20.6569 20.3431 22 22 22"
								stroke="#FCFCFC"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
					</div>
					{showStickerPicker && (
						<div
							className={style.interaction__stickerPicker}
							ref={stickerPickerRef}
							onClick={(e) => e.stopPropagation()}
							onMouseDown={(e) => e.stopPropagation()}
						>
							<StickerPicker
								onStickerSelect={onStickerSelect}
								onClose={() => setShowStickerPicker(false)}
							/>
						</div>
					)}
				</div>

				{/* Кнопка эмодзи */}
				<div className={style.interaction__emoji} ref={emojiRef}>
					<div
						className={style.interaction__emojiButton}
						onClick={() => {
							setShowPicker((prev) => !prev);
							setShowStickerPicker(false);
						}}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="#FCFCFC"
								strokeWidth="1.5"
							/>
							<path
								d="M8.5 9.5C8.5 8.67157 9.17157 8 10 8C10.2761 8 10.5 8.22386 10.5 8.5C10.5 8.77614 10.2761 9 10 9C9.72386 9 9.5 9.22386 9.5 9.5C9.5 9.77614 9.72386 10 10 10C10.2761 10 10.5 10.2239 10.5 10.5C10.5 10.7761 10.2761 11 10 11C9.17157 11 8.5 10.3284 8.5 9.5Z"
								fill="#FCFCFC"
							/>
							<circle cx="9" cy="9.5" r="1.5" fill="#FCFCFC" />
							<circle cx="15" cy="9.5" r="1.5" fill="#FCFCFC" />
							<path
								d="M8.5 14C9.5 16 14.5 16 15.5 14"
								stroke="#FCFCFC"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
					</div>
					{showPicker && (
						<div
							className={style.interaction__emojiPicker}
							ref={emojiPickerRef}
							onClick={(e) => e.stopPropagation()}
							onMouseDown={(e) => e.stopPropagation()}
						>
							<EmojiPicker
								onEmojiClick={onEmojiClick}
								theme="dark"
								width={320}
								height={400}
								searchPlaceholder="Поиск..."
								previewConfig={{ showPreview: false }}
								lazyLoadEmojis={true}
							/>
						</div>
					)}
				</div>
				<div className={style.interaction__send} onClick={onSend}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="19"
						height="18"
						viewBox="0 0 19 18"
						fill="none"
					>
						<path
							d="M9.05317 9.00264H2.90136M2.72699 9.83037L1.71063 12.9467C1.15398 14.6534 0.875649 15.5068 1.07539 16.0323C1.24884 16.4887 1.62138 16.8347 2.08108 16.9664C2.61043 17.118 3.40996 16.7487 5.00901 16.0102L15.2604 11.275C16.8212 10.5541 17.6017 10.1937 17.8428 9.6929C18.0524 9.25785 18.0524 8.74733 17.8428 8.31228C17.6017 7.81162 16.8212 7.45113 15.2604 6.73019L4.99133 1.98695C3.39709 1.25058 2.59998 0.882393 2.07116 1.03343C1.61189 1.1646 1.23939 1.50968 1.06533 1.9652C0.864906 2.48974 1.14026 3.34127 1.69098 5.04434L2.72897 8.25435C2.82354 8.54683 2.87084 8.69313 2.88951 8.84264C2.90608 8.97544 2.9059 9.10979 2.88901 9.24249C2.86996 9.392 2.82231 9.53809 2.72699 9.83037Z"
							stroke="#97BCE6"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			</div>
		);
	}
);

export default MessengerInteraction;
