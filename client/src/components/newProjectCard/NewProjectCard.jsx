import style from './newProjectCard.module.scss'

const NewProjectCard = () => {
	return (
		<div className={style.newProjectCard}>
			<div className="newProjectCard__preview">
				<img src="" alt="" />
			</div>
			<div className="newProjectCard__info">
				<div className="newProjectCard__content">
					<div className="newProjectCard__content__img">
						<img src="" alt="" />
					</div>
					<div className="newProjectCard__content__about">
						<h2 className="newProjectCard__title">Крестики нолики</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewProjectCard;