import { useContext, useEffect } from "react";
import { Context } from "../..";
import style from "./modalError.module.scss";

const ModalError = ({ error, setErrorModal }) => {
  const { modal } = useContext(Context);

  useEffect(() => {
    setTimeout(() => modal.setModalError(false), 5000);
  }, []);

  const onCloseModal = () => {
    if (setErrorModal) {
      return setErrorModal(false);
    }
    modal.setModalError(false);
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
          <path
            d="M1 11.0901H21"
            stroke="#FCFCFC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M11 21L11 1Z" fill="#27323E" />
          <path
            d="M11 21L11 1"
            stroke="#FCFCFC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className={style.modal__message}>{error}</p>
    </div>
  );
};

export default ModalError;
