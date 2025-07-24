import React, { useContext, useEffect, useState } from "react";

import style from "./secondStageReg.module.scss";

import RegistrationButton from "../primaryButton/PrimaryButton";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const SecondStageReg = observer(({ errorModal }) => {
	const { user } = useContext(Context);
	const [groupValue, setGroupValue] = useState(user.dataAuth.group);
	const [aboutValue, setAboutValue] = useState(user.dataAuth.about);
	const [file, setFile] = useState(user.dataAuth.avatar);
	const [aboutCount, setAboutCount] = useState(350);

	const [newData, setNewData] = useState({});

	useEffect(() => {
		user.setCodeAuth(
			Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
		);
	}, []);

	useEffect(() => {
		setNewData({
			group: groupValue,
			about: aboutValue,
			avatar: file,
		});
	}, [groupValue, aboutValue, file]);

	useEffect(() => {
		user.setDataAuth({ ...user.dataAuth, ...newData });
	}, [newData]);

	const changeSelect = (e) => {
		setGroupValue(e.target.value);
	};

	const changeArea = (e) => {
		setAboutValue(e.target.value.slice(0, 350));
		setAboutCount(350 - e.target.value.slice(0, 350).length)
	};

	const selectFile = (e) => {
		setFile(e.target.files[0]);
	};

	useEffect(() => {
		if (groupValue == "Выберите группу") {
			user.setErrorAuth(true);
		} else user.setErrorAuth(false);
	}, [groupValue]);

	return (
		<div className={style.second}>
			<div className={style.second__inner}>
				<div className={style.second__row}>
					<label className={style.second__item}>
						<h2 className={style.second__itemTitle}>Группа</h2>
						<select
							value={groupValue}
							onChange={changeSelect}
							className={style.second__itemGroup}
							style={
								errorModal && user.dataAuth.group === "Выберите группу"
									? { border: "2px solid rgb(255, 149, 149)" }
									: null
							}
						>
							<option
								className={style.second__itemGroupValue}
								disabled
								value="Выберите группу"
							>
								Выберите группу
							</option>
							<option className={style.second__itemGroupValue} value="1">
								ИС 11/9
							</option>
							<option className={style.second__itemGroupValue} value="2">
								ИС 12/9
							</option>
							<option className={style.second__itemGroupValue} value="3">
								ИС 13/9
							</option>
							<option className={style.second__itemGroupValue} value="4">
								ИС 21/9
							</option>
							<option className={style.second__itemGroupValue} value="5">
								ИС 22/9
							</option>
							<option className={style.second__itemGroupValue} value="6">
								ИС 23/9
							</option>
							<option className={style.second__itemGroupValue} value="7">
								ИС 31/9
							</option>
							<option className={style.second__itemGroupValue} value="8">
								ИС 32/9
							</option>
							<option className={style.second__itemGroupValue} value="9">
								ИС 33/9
							</option>
							<option className={style.second__itemGroupValue} value="10">
								ИС 41/9
							</option>
							<option className={style.second__itemGroupValue} value="11">
								ИС 42/9
							</option>
							<option className={style.second__itemGroupValue} value="12">
								ИС 43/9
							</option>
						</select>
					</label>
					<div className={style.second__item}>
						<h2 className={style.second__itemTitle}>Аватар</h2>
						<label className={style.second__itemBtn}>
							<p>
								{file
									? file.name.length > 20
										? file.name.slice(0, 20) + "..."
										: file.name
									: "Загрузить"}
							</p>
							<input
								onChange={selectFile}
								accept="image/png, image/gif, image/jpeg"
								type="file"
								style={{ display: "none" }}
							/>
						</label>
					</div>
				</div>
				<div className={style.second__row}>
					<label>
						<h2 className={style.second__itemTitle}>
							Немного информации о себе <span>({aboutCount})</span>
						</h2>
						<textarea
							value={aboutValue}
							onChange={changeArea}
							className={`${style.second__itemInput} ${style.second__itemInputArea}`}
						/>
					</label>
				</div>
			</div>
		</div>
	);
});

export default SecondStageReg;
