import React, { useContext } from "react";

import style from "./addProjectStages.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const AddProjectStages = observer(({ stages, setStages }) => {
	const { modal, project } = useContext(Context)

	const onButton = (e) => {
		let message = [];
		if (
			!project.projectName ||
			!project.projectDescr ||
			!project.projectSelectedPath ||
			!project.projectPreview
		) {
			if (!project.projectName) {
				message.push(`Название не заполнено`);
			}

			if (!project.projectDescr) {
				message.push(`Описание не заполнено`);
			}

			if (!project.projectSelectedPath) {
				message.push(`Файл не выбран`);
			}

			if (!project.projectPreview) {
				message.push(`Превью не выбрано`);
			}

			modal.setModalError(true);
			modal.setModalErrorMessage(message.join(`\n \n`));
			return;
		}
		setStages(3);
	};
	return (
		<div className={style.block}>
			<div className={style.block__item} onClick={() => setStages(2)}>
				<div className={stages >= 2 ? style.block__itemCircle + " " + style.block__itemCircle_active : style.block__itemCircle}></div>
				<span className={style.block__itemTitle}>Информация</span>
			</div>
			<span className={stages === 3 ? style.block__line + " " + style.block__line_active : style.block__line}></span>
			<div className={style.block__item} onClick={onButton}>
				<div className={stages === 3 ? style.block__itemCircle + " " + style.block__itemCircle_active : style.block__itemCircle}></div>
				<span className={style.block__itemTitle}>Доступность</span>
			</div>
		</div>
	);
})

export default AddProjectStages;
