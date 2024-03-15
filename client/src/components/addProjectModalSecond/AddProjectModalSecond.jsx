import React, { useContext, useEffect, useState } from "react";

import { observer } from "mobx-react-lite";

import style from "./addProjectModalSecond.module.scss";
import ProjectViewer from "../ProjectViewer/ProjectViewer";
import { Context } from "../..";
import { useRef } from "react";

const AddProjectModalSecond = observer(
	({ projectPathes, setStages, uniqueFolder, baseURL }) => {
		const { project, modal } = useContext(Context);

		const [countName, setCountName] = useState(70 - project.projectName.length)
		const [countDescr, setCountDescr] = useState(500 - project.projectDescr)

		const onSelectPath = (e) => {
			project.setProjectPath(uniqueFolder + "/" + e.target.value);
			project.setProjectSelectedPath(e.target.value);
		};

		const styles = {
			width: `calc((1 / (215 / 960)) * 100%)`,
			height: `calc((1 / (215 / 960)) * 100%)`,
			position: 'absolute',
			transform: `scale(calc(215 / 960))`,
			MozTransformStyle: `scale(calc(215 / 960))`,
			OTransform: `scale(calc(215 / 960))`,
			WebkitTransform: `scale(calc(215 / 960))`,
		}

		// console.log(projectRef.current.offsetHeight)

		const selectPreviewFile = (e) => {
			project.setProjectPreview(e.target.files[0]);
		};

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

		const onChangeName = (e) => {
			project.setProjectName(e.target.value.slice(0, 50));
			setCountName(50 - project.projectName.length)
		}

		const onChangeDescr = (e) => {
			project.setProjectDescr(e.target.value.slice(0, 500));
			setCountDescr(500 - project.projectDescr.length)
		}

		return (
			<div className={style.block}>
				<div className={style.block__info}>
					<div className={style.block__infoItem}>
						<h2 className={style.block__infoItemTitle}>Название <span className={style.block__infoItemCount}>({countName})</span></h2>
						<input
							className={style.block__infoItemInput}
							type="text"
							value={project.projectName}
							onChange={onChangeName}
						/>

					</div>
					<div className={style.block__infoItem}>
						<h2 className={style.block__infoItemTitle}>Описание <span className={style.block__infoItemCount}>({countDescr})</span></h2>
						<textarea
							className={
								style.block__infoItemInput +
								" " +
								style.block__infoItemInput_area
							}
							name=""
							id=""
							cols="30"
							rows="10"
							value={project.projectDescr}
							onChange={onChangeDescr}
						></textarea>

					</div>
					<div className={style.block__infoItem}>
						<h2 className={style.block__infoItemTitle}>
							Путь до основного файла
						</h2>
						<select
							className={style.block__infoItemInput}
							onChange={onSelectPath}
							value={project.projectSelectedPath}
						>
							<option value="0" selected disabled>
								Выберите файл
							</option>
							{projectPathes &&
								projectPathes.map((item, i) => {
									if (item.split('.').at(-1) === 'html') {
										return (
											<option key={i} value={item}>
												{item}
											</option>
										);
									}
								})}
						</select>
					</div>
					<div className={style.block__infoItem}>
						<h2 className={style.block__infoItemTitle}>Превью</h2>
						<input
							style={{ display: "none" }}
							type="file"
							id="file_preview"
							onChange={selectPreviewFile}
							accept="image/png, image/jpeg"
						/>
						<label
							className={
								style.block__infoItemInput +
								" " +
								style.block__infoItemInput_preview
							}
							htmlFor="file_preview"
						>
							{project.projectPreview
								? project.projectPreview.name.length > 20
									? project.projectPreview.name.slice(0, 20) + "..."
									: project.projectPreview.name
								: "Загрузите фото"}
						</label>
					</div>
				</div>
				<div className={style.block__preview}>
					<h2 className={style.block__previewTitle}>Предпросмотр</h2>
					<div className={style.block__previewContent}>
						{
							project.projectPath.length > 0
								?
								<ProjectViewer
									pathFromProject={project.projectPath}
									baseURL={baseURL}
									styles={styles}
								/>
								:
								<div className={style.block__previewNone}>Выберите путь до файла</div>
						}
						<div className={style.block__previewText}>
							<h2 className={style.block__previewTextTitle}>
								{project.projectName}
							</h2>
							<p className={style.block__previewTextDescr}>
								{project.projectDescr}
							</p>
						</div>
					</div>
				</div>
				<button className={style.block__button} onClick={onButton}>
					Далее
				</button>
			</div>
		);
	}
);

export default AddProjectModalSecond;
