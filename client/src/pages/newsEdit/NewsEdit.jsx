import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './newsEdit.scss'
import EditorText from '../../components/editor/EditorText';
import FunctionButton from '../../components/functionButton/FunctionButton';
import { createNews } from '../../http/newsAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import Spinner from '../../components/spinner/Spinner';

const NewsEdit = observer(() => {

	const { user, modal } = useContext(Context)

	const editorInstanceRef = useRef(null);
	const editorContainerRef = useRef(null);
	const titleRef = useRef(null);
	const previewRef = useRef(null);

	const [preview, setPreview] = useState(null)
	const [title, setTitle] = useState('')
	const [titleIsEmpty, setTitleIsEmpty] = useState(true)
	const [descrIsEmpty, setDescrIsEmpty] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [isDisabled, setIsDisabled] = useState(false)




	const handleEditorChange = useCallback((content) => {
		if (!content.blocks.length) {
			setDescrIsEmpty(true)
		} else {
			setDescrIsEmpty(false)
		}
		console.log('Content changed! Current content:', content);
	}, []);

	const handleTitle = (e) => {
		if (e.key === "Enter") {
			e.preventDefault()
		}
	}

	const onTitle = (e) => {
		if (!e.target.innerText) {
			setTitleIsEmpty(true)
		} else {
			setTitleIsEmpty(false)
		}
		setTitle(e.target.innerText);
	}

	const onPreview = (e) => {
		setPreview(e.target.files[0])
	}

	const saveContent = async () => {

		try {
			let outputData = await editorInstanceRef.current.save();
			console.log(editorInstanceRef.current);
			let titleEmpty = true;
			let contentEmpty = true;

			if (outputData.blocks.length === 0) {
				contentEmpty = true
			} else {
				contentEmpty = false
			}
			if (titleRef.current.innerText === '') {
				titleEmpty = true
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
					editorInstanceRef.current.clear()
					titleRef.current.innerText = '';
					setTitle('')
					previewRef.current.value = ''
					setPreview(null)
					setTitleIsEmpty(true)
					setDescrIsEmpty(true)
					modal.setModalCompleteMessage("Новость отправлена на модерацию")
					modal.setModalComplete(true)
				}).catch(error => {
					console.log(error)
				}).finally(() => {
					setIsLoading(false)
				})
			} else {
				let message = [];
				if (titleEmpty) {
					message.push('Добавьте Заголовок')
				}
				if (contentEmpty) {
					message.push('Добавьте Описание')
				}
				if (!preview) {
					message.push('Добавьте Превью')
					console.log(preview);
				}

				console.log(titleEmpty);
				console.log(contentEmpty);
				modal.setModalErrorMessage(message.join(`\n \n`))
				modal.setModalError(true)
			}

		} catch (error) {
			console.error('Ошибка при сохранении', error);
		}
	};

	useEffect(() => {
		if (titleIsEmpty || descrIsEmpty) {
			setIsDisabled(true)
		} else {
			setIsDisabled(false)
		}
	}, [titleIsEmpty, descrIsEmpty])


	return (
		<div className="container">
			<div className='news-edit'>
				<div className="news-edit__wrapper">
					<div className="news-edit__wrapper-title">
						<div className="news-edit__dowload-preview">
							<input type="file" id='input-preview' accept="image/png, image/jpeg" className='news-edit__dowload-preview-input' ref={previewRef} onChange={onPreview} />
							<label htmlFor="input-preview" className='news-edit__dowload-preview-btn'>
								{preview ? preview.name.length > 10 ? preview.name.slice(0, 15) + '...' : preview.name : "Добавить превью"}
							</label>
						</div>
						<h1 ref={titleRef} className="news-edit__title" contentEditable onKeyDown={handleTitle} onInput={onTitle}></h1>
					</div>
					<EditorText onChange={handleEditorChange} editorInstanceRef={editorInstanceRef} editorContainerRef={editorContainerRef} />
					<div className='news-edit__save'>
						<FunctionButton onClick={saveContent} disabled={isDisabled || isLoading}>{isLoading ? <Spinner /> : 'Опубликовать'}</FunctionButton>
					</div>
				</div>
			</div>
		</div>

	);
});

export default NewsEdit;