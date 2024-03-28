import { useRef, useState } from 'react';
import './newsEdit.scss'

const NewsEdit = () => {
	const [newsContent, setNewsContent] = useState([
		{ order: 1, content: '1', isImage: false },
		{ order: 2, content: 'Текст', isImage: false },
	])
	const [heading, setHeading] = useState('sdf')
	const [paragraph, setParagraph] = useState('')

	const [isContentEditTitle, setIsContentEditTitle] = useState(true)

	const contentRef = useRef(null)
	const titleRef = useRef(null)


	const handleInput = (e) => {
		const focusedElement = document.activeElement;
		const nodeName = focusedElement.nodeName;
		console.log(newsContent[0].content);

		if (titleRef.current.onFocus) {
			setNewsContent(prev => [...prev, { order: 1, content: e.target.innerText, isImage: false }])
		}

		if
			(
			e.key === 'Backspace' && !newsContent[0].content == <br />
		) {
			e.preventDefault()
		}
	};

	const handleTitleBlur = () => {
		// Проверить, если заголовок пустой, то вернуть его исходное значение
		if (titleRef.current.innerText.trim() === '') {
			setNewsContent(prev => {
				return prev.map(item => {
					if (item.order === 1) {
						return { ...item, content: 'Заголовок' };
					}
					return item;
				});
			});
		}
	};

	return (
		<div className="container">
			<div className='news-edit'>
				<div className="news-edit__wrapper">
					<div className="news-edit__content" contentEditable onInput={handleInput} ref={contentRef}>
						{
							newsContent.map(({ order, content, isImage }) => {
								if (order === 1) {
									return (
										<h1 ref={titleRef} className="news-edit__title" onBlur={handleTitleBlur}>{content}</h1>
									)
								} else if (isImage) {
									return (
										<img src={content} alt="" />
									)
								} else {
									return (
										<p className="news-edit__paragraph">{content}</p>
									)
								}

							})
						}
					</div>
				</div>
			</div>
		</div>

	);
};

export default NewsEdit;