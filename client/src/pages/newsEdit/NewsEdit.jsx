import { useCallback, useContext, useRef, useState } from 'react';
import './newsEdit.scss'
import EditorText from '../../components/editor/EditorText';
import FunctionButton from '../../components/functionButton/FunctionButton';
import { createNews } from '../../http/newsAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';

const NewsEdit = observer(() => {

	const { user } = useContext(Context)

	const editorInstanceRef = useRef(null);
	const editorContainerRef = useRef(null);
	const titleRef = useRef(null);

	const [preview, setPreview] = useState(null)
	const [title, setTitle] = useState('')
	const [isLoading, setIsLoading] = useState(false)



	const handleEditorChange = useCallback((content) => {
		console.log('Content changed! Current content:', content);
	}, []);

	const handleTitle = (e) => {
		if (e.key === "Enter") {
			e.preventDefault()
		}
	}

	const onTitle = (e) => {
		setTitle(e.target.innerText);
	}

	const saveContent = async () => {

		try {
			const outputData = await editorInstanceRef.current.save();
			console.log('Data to save:', outputData);
			let titleEmpty = true;
			let contentEmpty = true;

			if (outputData.blocks.length === 0) {
				contentEmpty = true
				const paragraphs = editorContainerRef.current.querySelectorAll('.ce-paragraph');
				for (const paragraph of paragraphs) {
					console.log('fdsfsd')
					if (!paragraph.textContent.trim()) {
						// Если параграф пустой, подсвечиваем его
						paragraph.classList.add('editor-empty-highlight');
						// Удаляем подсветку через 1 секунду
						setTimeout(() => {
							paragraph.classList.remove('editor-empty-highlight');
						}, 1000);
					}
				}
			} else {
				contentEmpty = false
			}
			if (titleRef.current.innerText === '') {
				titleEmpty = true
				titleRef.current.classList.add('editor-empty-highlight')
				setTimeout(() => {
					titleRef.current.classList.remove('editor-empty-highlight');
				}, 1000);
			} else {
				titleEmpty = false
			}

			if (!titleEmpty && !contentEmpty && preview) {
				setIsLoading(true)
				const formData = new FormData();
				formData.append('img', preview)
				formData.append('title', title)
				formData.append('description', JSON.stringify(outputData.blocks))
				formData.append('userId', user.user.id)
				createNews(formData).then((data) => {
					console.log("Опубликовано")
				}).catch(error => {
					console.log(error)
				}).finally(() => {
					setIsLoading(false)
				})
			}


		} catch (error) {
			console.error('Ошибка при сохранении', error);
		}
	};


	return (
		<div className="container">
			<div className='news-edit'>
				<div className="news-edit__wrapper">
					<div className="news-edit__wrapper-title">
						<div className="news-edit__dowload-preview">
							<input type="file" id='input-preview' className='news-edit__dowload-preview-input' onChange={(e) => setPreview(e.target.files[0])} />
							<label htmlFor="input-preview" className='news-edit__dowload-preview-btn'>
								{preview ? preview.name.length > 10 ? preview.name.slice(0, 15) + '...' : preview.name : "Добавить превью"}
							</label>
						</div>
						<h1 ref={titleRef} className="news-edit__title" contentEditable onKeyDown={handleTitle} onInput={onTitle}></h1>
					</div>
					<EditorText onChange={handleEditorChange} editorInstanceRef={editorInstanceRef} editorContainerRef={editorContainerRef} />
					<div className='news-edit__save'>
						<FunctionButton onClick={saveContent}>Опубликовать</FunctionButton>
					</div>
				</div>
			</div>
		</div>

	);
});

export default NewsEdit;