import React, { useContext, useState } from "react";

import style from "./addProjectModalFirst.module.scss";
import { Context } from "../..";
import { uploadProject } from "../../http/userAPI";
import Spinner from "../spinner/Spinner";

function AddProjectModalFirst({ setFile, file, setStages, setProjectPathes, setUniqueFolder, setBaseURL }) {
	const { modal, project } = useContext(Context)
	const [isLoading, setIsLoading] = useState(false);


	const onChangeStages = async (e) => {
		setIsLoading(true);
		let fileExt = e.target.files[0].name.split('.').at(-1);
		if (fileExt !== 'zip') {
			modal.setModalErrorMessage('Доступные расширения: .zip')
			modal.setModalError(true)
			setIsLoading(false);
			return
		}
		const formData = new FormData();
		formData.append("projectFile", e.target.files[0]);
		await uploadProject(formData)
			.then((data) => {
				setFile(e.target.files[0]);
				setProjectPathes(data.filePaths);
				setUniqueFolder(data.normalPath);
				setBaseURL(data.baseUrl);
				project.setBaseURL(data.baseUrl);
				setIsLoading(false);
				setStages(2);
			}).catch((err) => {
				modal.setModalErrorMessage(err.response.data.message);
				modal.setModalError(true)
				e.target.value = ''
				setIsLoading(false);
			});
	};
	return (
		<div className={style.block}>
			<div className={style.block__icon}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="143"
					height="178"
					viewBox="0 0 143 178"
					fill="none"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M71.5 4.4375C71.5 1.98674 69.5133 0 67.0625 0H36C16.3939 0 0.5 15.8939 0.5 35.5V142C0.5 161.606 16.3939 177.5 36 177.5H107C126.606 177.5 142.5 161.606 142.5 142V75.4375C142.5 72.9867 140.513 71 138.062 71H115.875C91.3674 71 71.5 51.1326 71.5 26.625V4.4375ZM135.573 53.25C138.524 53.25 140.644 50.4005 139.227 47.8123C138.023 45.6148 136.505 43.5791 134.702 41.7756L100.724 7.79828C98.9209 5.99474 96.8852 4.47666 94.6877 3.27313C92.0995 1.85564 89.25 3.9764 89.25 6.92737V26.625C89.25 41.3296 101.17 53.25 115.875 53.25H135.573ZM71.5 79.875C76.4015 79.875 80.375 83.8485 80.375 88.75V120.574L91.8494 109.099C95.3153 105.634 100.935 105.634 104.401 109.099C107.866 112.565 107.866 118.185 104.401 121.651L77.7756 148.276C74.3097 151.741 68.6903 151.741 65.2244 148.276L38.5994 121.651C35.1335 118.185 35.1335 112.565 38.5994 109.099C42.0653 105.634 47.6847 105.634 51.1506 109.099L62.625 120.574V88.75C62.625 83.8485 66.5985 79.875 71.5 79.875Z"
						fill="white"
					/>
				</svg>
			</div>
			<input
				className={style.block__file}
				type="file"
				name="file"
				id="input_file"
				value={file}
				onChange={onChangeStages}
				accept=".zip"
				disabled={isLoading}
			/>
			<span className={style.descr_file}>Загрузите ZIP-архив</span>
			<label htmlFor="input_file" className={style.block__button}>
				{
					isLoading ? <Spinner /> : 'Выбрать файлы'
				}
			</label>
		</div>
	);
}

export default AddProjectModalFirst;
