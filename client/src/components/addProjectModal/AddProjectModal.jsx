import React, { useContext, useEffect, useState } from "react";

import style from "./addProjectModal.module.scss";
import "./animate.scss";
import AddProjectStages from "../addProjectStages/AddProjectStages";
import AddProjectModalFirst from "../addProjectModalFirst/AddProjectModalFirst";
import AddProjectModalSecond from "../addProjectModalSecond/AddProjectModalSecond";
import AddProjectModalThird from "../addProjectModalThird/AddProjectModalThird";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { uploadProject } from "../../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import Cross from "../cross/Cross";

const AddProjectModal = observer(() => {
	const { project, user } = useContext(Context);

	const [stages, setStages] = useState(1);
	const [file, setFile] = useState(null);

	const [projectPathes, setProjectPathes] = useState([]);
	const [uniqueFolder, setUniqueFolder] = useState("");
	const [baseURL, setBaseURL] = useState("");




	return (
		<div className={style.block} onMouseDown={(e) => e.stopPropagation()}>
			<div className={style.block__header}>
				<h2 className={style.block__headerTitle}>Загрузка проекта</h2>
				<div className={style.block__headerClose}>
					<Cross onClick={() => user.setModalProject(false)} />
				</div>
			</div>
			<div
				className={
					stages > 1
						? style.block__stage + " " + style.block__stage_active
						: style.block__stage
				}
			>
				{stages > 1 && (
					<AddProjectStages stages={stages} setStages={setStages} />
				)}
			</div>
			<SwitchTransition mode="out-in">
				<CSSTransition key={stages} timeout={300} classNames="node">
					<div className={style.block__content}>
						{
							stages === 2 ? (
								<AddProjectModalSecond
									projectPathes={projectPathes}
									setStages={setStages}
									uniqueFolder={uniqueFolder}
									baseURL={baseURL}
								/>
							) : stages === 3 ? (
								<AddProjectModalThird baseURL={baseURL} />
							) : (
								<AddProjectModalFirst
									setFile={setFile}
									file={file}
									setStages={setStages}
									setProjectPathes={setProjectPathes}
									setUniqueFolder={setUniqueFolder}
									setBaseURL={setBaseURL}
								/>
							)}
					</div>
				</CSSTransition>
			</SwitchTransition>
		</div>
	);
});

export default AddProjectModal;
