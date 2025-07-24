import React, { useContext, useState } from "react";

import style from "./addProjectModalThird.module.scss";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ProjectViewer from "../ProjectViewer/ProjectViewer";
import { uploadFinishedProject } from "../../http/projectAPI";
import Spinner from "../spinner/Spinner";

const AddProjectModalThird = observer(({ baseURL }) => {
	const { user, project, modal } = useContext(Context);

	const [isLoading, setIsLoading] = useState(false);

	const upload = async () => {
		setIsLoading(true);
		const formData = new FormData();
		formData.append("name", project.projectName);
		formData.append("description", project.projectDescr);
		formData.append("path_from_project", project.projectPath);
		formData.append("baseURL", project.baseURL);
		formData.append("preview", project.projectPreview);
		formData.append("is_private", project.projectPrivate);
		formData.append("is_private_comments", project.projectPrivateComments);
		formData.append("userId", user.user.id);
		const response = await uploadFinishedProject(formData)
			.then((data) => {
				modal.setModalCompleteMessage("Проект успешно добавлен!");
				modal.setModalComplete(true);
				user.setModalProject(false);
				setIsLoading(false)
			})
			.catch((e) => console.log(e));
		return response;
	};

	return (
		<div className={style.AddProjectModalThird}>
			<div className={style.AddProjectModalThird__settings__wpapper}>
				<div className={style.AddProjectModalThird__settings}>
					<div className={style.AddProjectModalThird__settings__title}>
						Приватность
					</div>
					<div
						onClick={() => project.setProjectPrivate(false)}
						className={style.AddProjectModalThird__settings__select}
					>
						<input
							type="radio"
							checked={!project.projectPrivate && true}
							name=""
							id="radio1"
							className={style.AddProjectModalThird__settings__select__box}
						/>{" "}
						<span>Открытый проект</span>
					</div>
					<div
						onClick={() => project.setProjectPrivate(true)}
						className={style.AddProjectModalThird__settings__select}
					>
						<input
							type="radio"
							checked={project.projectPrivate && true}
							name=""
							id="radio2"
							className={style.AddProjectModalThird__settings__select__box}
						/>{" "}
						<span>Приватный проект</span>
					</div>
				</div>
				<div className={style.AddProjectModalThird__settings}>
					<div className={style.AddProjectModalThird__settings__title}>
						Комментарии
					</div>
					<div
						onClick={() => project.setProjectPrivateComments(false)}
						className={style.AddProjectModalThird__settings__select}
					>
						<input
							type="radio"
							checked={!project.projectPrivateComments && true}
							name=""
							id="radio3"
							className={style.AddProjectModalThird__settings__select__box}
						/>{" "}
						<span>Разрешить</span>
					</div>
					<div
						onClick={() => project.setProjectPrivateComments(true)}
						className={style.AddProjectModalThird__settings__select}
					>
						<input
							type="radio"
							checked={project.projectPrivateComments && true}
							name=""
							id="radio4"
							className={style.AddProjectModalThird__settings__select__box}
						/>{" "}
						<span>Запретить</span>
					</div>
				</div>
			</div>
			<div className={style.AddProjectModalThird__preview}>
				<div className={style.AddProjectModalThird__preview__title}>
					Предпросмотр
				</div>
				<div className={style.AddProjectModalThird__preview__canvas}>
					<ProjectViewer
						pathFromProject={project.projectPath}
						baseURL={baseURL}
					/>
					<div className={style.AddProjectModalThird__previewText}>
						<h2 className={style.AddProjectModalThird__previewTextTitle}>
							{project.projectName}
						</h2>

						<p className={style.AddProjectModalThird__previewTextDescr}>
							{project.projectDescr}
						</p>
					</div>
				</div>
			</div>
			<button className={style.AddProjectModalThird__button} disabled={isLoading} onClick={upload}>
				{isLoading ? <div style={{ width: "163px" }}><Spinner /></div> : "Опубликовать"}
			</button>
		</div>
	);
});

export default AddProjectModalThird;
