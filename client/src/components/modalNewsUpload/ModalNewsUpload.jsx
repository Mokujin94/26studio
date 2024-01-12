import React, { useContext, useState } from 'react';

import style from './modalNewsUpload.module.scss';
import FunctionButton from '../functionButton/FunctionButton';
import { Context } from '../..';
import { createNews } from '../../http/newsAPI';
import { observer } from 'mobx-react-lite';

const ModalNewsUpload = observer(() => {
  const { user, modal } = useContext(Context);
  const [title, setTitle] = useState('');
  const [descr, setDescr] = useState('');
  const [file, setFile] = useState(null);

  const addNews = () => {
    const formdata = new FormData();
    formdata.append('title', title);
    formdata.append('description', descr);
    formdata.append('img', file);
    createNews(formdata).then((data) => {
      modal.setModalCompleteMessage('Новость отправлена на проверку!');
      modal.setModalComplete(true);
      user.setModalNews(false);
    });
  };

  return (
    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
      <div className={style.modal__close} onClick={() => user.setModalNews(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
          <path d="M1 11.0901H21Z" fill="#27323E" />
          <path d="M1 11.0901H21" stroke="#FCFCFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 21L11 1Z" fill="#27323E" />
          <path d="M11 21L11 1" stroke="#FCFCFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className={style.modal__title}>Предложить новость</h3>
      <div className={style.modal__content}>
        <div className={style.modal__contentInputs}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className={style.modal__contentInputsItem}
            placeholder="Название"
          />
          <textarea
            value={descr}
            onChange={(e) => setDescr(e.target.value)}
            name=""
            id=""
            className={style.modal__contentInputsItem}
            placeholder="Описание"
          ></textarea>
        </div>
        <label htmlFor="modalImage" className={style.modal__contentPreview}>
          <div className={style.modal__contentPreviewImage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="143" height="178" viewBox="0 0 143 178" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M71.5 4.4375C71.5 1.98674 69.5133 0 67.0625 0H36C16.3939 0 0.5 15.8939 0.5 35.5V142C0.5 161.606 16.3939 177.5 36 177.5H107C126.606 177.5 142.5 161.606 142.5 142V75.4375C142.5 72.9867 140.513 71 138.062 71H115.875C91.3674 71 71.5 51.1326 71.5 26.625V4.4375ZM135.573 53.25C138.524 53.25 140.644 50.4005 139.227 47.8123C138.023 45.6148 136.505 43.5791 134.702 41.7756L100.724 7.79828C98.9209 5.99474 96.8852 4.47666 94.6877 3.27313C92.0995 1.85564 89.25 3.9764 89.25 6.92737V26.625C89.25 41.3296 101.17 53.25 115.875 53.25H135.573ZM71.5 79.875C76.4015 79.875 80.375 83.8485 80.375 88.75V120.574L91.8494 109.099C95.3153 105.634 100.935 105.634 104.401 109.099C107.866 112.565 107.866 118.185 104.401 121.651L77.7756 148.276C74.3097 151.741 68.6903 151.741 65.2244 148.276L38.5994 121.651C35.1335 118.185 35.1335 112.565 38.5994 109.099C42.0653 105.634 47.6847 105.634 51.1506 109.099L62.625 120.574V88.75C62.625 83.8485 66.5985 79.875 71.5 79.875Z"
                fill="white"
              />
            </svg>
          </div>
          <span className={style.modal__contentPreviewSubtitle}>Загрузить превью</span>
          <input onChange={(e) => setFile(e.target.files[0])} type="file" name="modalImage" id="modalImage" />
        </label>
      </div>
      <div className={style.modal__bottom}>
        <div className={style.modal__bottomBtn}>
          <FunctionButton onClick={addNews}>Предложить новость</FunctionButton>
        </div>
        <span className={style.modal__bottomText}>
          *Каждая новость проходит проверку. После модерации новость появится на сайте
        </span>
      </div>
    </div>
  );
});

export default ModalNewsUpload;
