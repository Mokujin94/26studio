import { useContext } from 'react';
import style from './modalComplete.module.scss';
import { Context } from '../..';

const ModalComplete = ({ completeMessage, setCompleteModal }) => {
  const { modal } = useContext(Context);
  const onCloseModal = () => {
    if (setCompleteModal) {
      return setCompleteModal(false);
    }
    modal.setModalComplete(false);
  };
  return (
    <div className={style.modal}>
      <div className={style.modal__close} onClick={onCloseModal}>
        <svg
          className={style.modal__close_icon}
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
        >
          <path d="M1 11.0901H21Z" fill="#27323E" />
          <path d="M1 11.0901H21" stroke="#FCFCFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 21L11 1Z" fill="#27323E" />
          <path d="M11 21L11 1" stroke="#FCFCFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className={style.modal__message}>{completeMessage}</p>
    </div>
  );
};

export default ModalComplete;
