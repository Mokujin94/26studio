import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import style from "./messageContent.module.scss";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { CSSTransition } from "react-transition-group";
import { useClickOutside } from "../../hooks/useClickOutside";
import Linkify from "react-linkify";
import LinkPreview from "../linkPreview/linkPreview";

// Функция для определения, состоит ли текст только из эмодзи
const isEmojiOnly = (text) => {
	if (!text || text.trim().length === 0) return false;

	// Регулярное выражение для эмодзи (Unicode emoji ranges)
	const emojiRegex =
		/^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Component}|\s)+$/u;

	return emojiRegex.test(text.trim());
};

// Подсчёт количества эмодзи в тексте
const countEmojis = (text) => {
	if (!text) return 0;

	const emojiRegex =
		/\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?/gu;
	const matches = text.match(emojiRegex);

	return matches ? matches.length : 0;
};

// Функция для парсинга стикера из текста сообщения
const parseSticker = (text) => {
	if (!text) return null;

	// Формат: [sticker:emoji:😀] или [sticker:image:url]
	const stickerMatch = text.match(/^\[sticker:(emoji|image):(.+)\]$/);

	if (stickerMatch) {
		const type = stickerMatch[1];
		const value = stickerMatch[2];

		return {
			type,
			value,
			isEmoji: type === "emoji",
			isImage: type === "image",
		};
	}

	return null;
};

const MessageContent = ({
	contextMenu,
	onContextMenu,
	isScrollBottom,
	windowChatRef,
	content,
	isOther,
	onVisible,
	isRead,
	load,
}) => {
	const messageRef = useRef(null);

	const [isSubMenu, setIsSubMenu] = useState(Boolean);
	const [lightboxIndex, setLightboxIndex] = useState(null);

	const subMenuRef = useRef(null);

	const files = content.files || [];
	const isLightboxOpen = lightboxIndex !== null && files.length > 0;

	const goToPrev = useCallback(() => {
		if (lightboxIndex > 0) {
			setLightboxIndex(lightboxIndex - 1);
		}
	}, [lightboxIndex]);

	const goToNext = useCallback(() => {
		if (lightboxIndex < files.length - 1) {
			setLightboxIndex(lightboxIndex + 1);
		}
	}, [lightboxIndex, files.length]);

	const closeLightbox = useCallback(() => {
		setLightboxIndex(null);
	}, []);

	// Обработка клавиш для навигации
	useEffect(() => {
		if (!isLightboxOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				closeLightbox();
			} else if (e.key === "ArrowLeft") {
				goToPrev();
			} else if (e.key === "ArrowRight") {
				goToNext();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isLightboxOpen, goToPrev, goToNext, closeLightbox]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					//
					onVisible(content.id); // Сообщение стало видимым, вызываем обработчик
					observer.disconnect(); // Прекращаем наблюдение после первого срабатывания
				}
			},
			{ threshold: 0.5 } // Процент видимости, при котором срабатывает событие
		);

		if (messageRef.current) {
			observer.observe(messageRef.current); // Начинаем наблюдать за элементом
		}
		return () => {
			observer.disconnect(); // Чистка при размонтировании компонента
		};
	}, [content]);

	const onSubMenu = (e) => {
		e.preventDefault();
		if (isSubMenu == true) {
			return;
		}
		setIsSubMenu((prev) => !prev);
	};

	useClickOutside(subMenuRef, () => {
		setIsSubMenu(false);
	});

	// const [isRead, setIsRead] = useState(false)
	const time = useTimeFormatter(content.createdAt);

	// Определяем, является ли сообщение стикером
	const stickerInfo = useMemo(() => parseSticker(content.text), [content.text]);

	// Определяем, является ли сообщение только эмодзи
	const emojiInfo = useMemo(() => {
		// Если это стикер, не применяем emoji стили
		if (stickerInfo) {
			return { isEmojiOnly: false, emojiCount: 0, sizeClass: "" };
		}

		const onlyEmoji = isEmojiOnly(content.text);
		const emojiCount = onlyEmoji ? countEmojis(content.text) : 0;

		return {
			isEmojiOnly: onlyEmoji,
			emojiCount: emojiCount,
			// Размер зависит от количества эмодзи
			sizeClass: onlyEmoji
				? emojiCount <= 3
					? style.messageContent__emojiLarge
					: emojiCount <= 6
					? style.messageContent__emojiMedium
					: style.messageContent__emojiSmall
				: "",
		};
	}, [content.text, stickerInfo]);

	const renderLinkPreview = (text) => {
		const urlRegex =
			/((https?:\/\/)?[^\s.]+\.[^\s]{2,}|localhost:\d{4,5}\/[^\s]*)/g;
		const urls = text.match(urlRegex);

		if (urls) {
			return (
				<>
					{urls.map((url, index) => {
						// Добавляем http:// если протокол не указан
						if (!url.startsWith("http://") && !url.startsWith("https://")) {
							url = "http://" + url;
						}
						return (
							<LinkPreview
								isOther={isOther}
								isScrollBottom={isScrollBottom}
								windowChatRef={windowChatRef}
								key={index}
								url={url}
							/>
						);
					})}
				</>
			);
		}
	};

	return (
		// <div ref={subMenuRef} style={{ position: 'relative' }}>

		<div
			onContextMenu={(e) => {
				e.preventDefault();
				onContextMenu(e, content);
			}}
			ref={messageRef}
			id={`message-${content.id}`}
			className={
				contextMenu.message.id === content.id
					? style.messageContent__highlight_active +
					  " " +
					  style.messageContent__highlight
					: style.messageContent__highlight
			}
		>
			<div
				className={`${style.messageContent} ${
					isOther ? style.messageContent_other : ""
				} ${emojiInfo.isEmojiOnly ? style.messageContent_emojiOnly : ""} ${
					emojiInfo.sizeClass
				} ${stickerInfo ? style.messageContent_sticker : ""}`}
			>
				{content.replyMessage && (
					<div
						className={style.messageContent__reply}
						onClick={() => {
							const el = document.getElementById(
								`message-${content.replyMessage.id}`
							);
							if (el && windowChatRef?.current) {
								windowChatRef.current.scrollTo({
									top: el.offsetTop - 50,
									behavior: "smooth",
								});
							}
						}}
					>
						<p className={style.messageContent__replyUser}>
							{content.replyMessage.user?.name}
						</p>
						<span className={style.messageContent__replyText}>
							{content.replyMessage.text}
						</span>
					</div>
				)}

				{files.length > 0 && (
					<div
						className={`${style.messageContent__images} ${
							style["messageContent__images_" + Math.min(files.length, 4)]
						}`}
					>
						{files.map((src, idx) => (
							<img
								key={idx}
								src={src}
								alt=""
								onClick={() => setLightboxIndex(idx)}
							/>
						))}
					</div>
				)}

				{isLightboxOpen &&
					createPortal(
						<div
							className={style.messageContent__lightbox}
							onClick={closeLightbox}
						>
							{/* Кнопка "Предыдущее" */}
							{lightboxIndex > 0 && (
								<button
									className={style.messageContent__lightboxPrev}
									onClick={(e) => {
										e.stopPropagation();
										goToPrev();
									}}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M15 18L9 12L15 6"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							)}

							<img
								src={files[lightboxIndex]}
								alt=""
								onClick={(e) => e.stopPropagation()}
							/>

							{/* Кнопка "Следующее" */}
							{lightboxIndex < files.length - 1 && (
								<button
									className={style.messageContent__lightboxNext}
									onClick={(e) => {
										e.stopPropagation();
										goToNext();
									}}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9 18L15 12L9 6"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							)}

							{/* Счётчик фото */}
							{files.length > 1 && (
								<div className={style.messageContent__lightboxCounter}>
									{lightboxIndex + 1} / {files.length}
								</div>
							)}

							<button
								className={style.messageContent__lightboxClose}
								onClick={closeLightbox}
							>
								×
							</button>
						</div>,
						document.body
					)}
				{/* Отображение стикера или обычного текста */}
				{stickerInfo ? (
					<div className={style.messageContent__sticker}>
						{stickerInfo.isEmoji ? (
							<span className={style.messageContent__stickerEmoji}>
								{stickerInfo.value}
							</span>
						) : (
							<img
								src={stickerInfo.value}
								alt="sticker"
								className={style.messageContent__stickerImage}
							/>
						)}
					</div>
				) : (
					<>
						<span className={style.messageContent__text}>
							<Linkify>{content.text}</Linkify>
						</span>
						{renderLinkPreview(content.text)}
					</>
				)}
				<div className={style.messageContent__info}>
					<span className={style.messageContent__infoTime}>{time}</span>
					{!isOther && (
						<div
							className={
								isRead
									? style.messageContent__infoView +
									  " " +
									  style.messageContent__infoView_active
									: style.messageContent__infoView
							}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="17"
								height="10"
								viewBox="0 0 17 10"
								fill="none"
							>
								<path
									className={style.messageContent__infoViewSecond}
									d="M6.5 7L8 9L16 1"
									stroke="#27323E"
									strokeWidth="1.25"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M1 5.5L4 9C7.70998 5.09476 7.79002 4.90524 11.5 1"
									stroke="#27323E"
									strokeWidth="1.25"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					)}
					<div className={style.messageContent__info__visible}>
						<span className={style.messageContent__infoTime}>{time}</span>
						{!isOther &&
							(!load ? (
								<div
									className={
										isRead
											? style.messageContent__infoView +
											  " " +
											  style.messageContent__infoView_active
											: style.messageContent__infoView
									}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="17"
										height="10"
										viewBox="0 0 17 10"
										fill="none"
									>
										<path
											className={style.messageContent__infoViewSecond}
											d="M6.5 7L8 9L16 1"
											stroke="#27323E"
											strokeWidth="1.25"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M1 5.5L4 9C7.70998 5.09476 7.79002 4.90524 11.5 1"
											stroke="#27323E"
											strokeWidth="1.25"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							) : (
								load && (
									<div className={style.messageContent__infoLoad}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											viewBox="0 0 22 22"
											fill="none"
										>
											<path
												className={style.messageContent__infoLoadItem}
												d="M11 3.5V11"
												stroke="#1C274C"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												className={style.messageContent__infoLoadItem}
												d="M11 11H16"
												stroke="#1C274C"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M6 2.33782C7.47087 1.48697 9.1786 1 11 1C16.5228 1 21 5.47715 21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 9.1786 1.48697 7.47087 2.33782 6"
												stroke="#1C274C"
												strokeWidth="2"
												strokeLinecap="round"
											/>
										</svg>
									</div>
								)
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessageContent;
