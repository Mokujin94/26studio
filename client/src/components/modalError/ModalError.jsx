const ModalError = ({ error }) => {
  return (
    <div className="modal">
      <p className="error-message">{error}</p>
    </div>
  );
};

export default ModalError;
