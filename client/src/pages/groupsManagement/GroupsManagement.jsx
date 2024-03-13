import React, { useEffect, useRef, useState } from 'react'
import FriendCard from "../../components/friendCard/FriendCard"

import './groupsManagement.scss'

import PrimaryButton from '../../components/primaryButton/PrimaryButton';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { fetchAddStudent, fetchDeleteStudent, fetchGroupById, fetchGroups } from '../../http/groupsAPI'
import { fetchAllTutors, fetchAllUsers, fetchUsersByGroupStatus, searchUsersOnGroup } from '../../http/userAPI';
import { useDebounce } from '../../hooks/useDebounce';
import FriendSkeleton from '../../components/friendSkeleton/FriendSkeleton';


function GroupsManagement() {
	const [groupsData, setGroupsData] = useState([]);
	const [oneGroupData, setOneGroupData] = useState({});

	const [modalActive, setModalActive] = useState(false);

	const [usersData, setUsersData] = useState([]);
	const [tutorsData, setTutorsData] = useState([]);


	const [groupSelect, setGroupSelect] = useState(0);
	const [tutorSelect, setTutorSelect] = useState(0);
	const [view, setView] = useState(0);

	const [search, setSearch] = useState('');
	const useDebounced = useDebounce(search)

	const [loading, setLoading] = useState(true);

	const nodeRef = useRef(null);

	useEffect(() => {
		setLoading(true)
		fetchGroups().then(data => {
			setGroupsData(data.rows.sort((a, b) => a.id > b.id ? 1 : -1));
		});

		fetchAllTutors().then(data => {
			setTutorsData(data)
		})
	}, [])

	useEffect(() => {
		setLoading(true);
		let group_status = view == 0 ? true : false
		if (groupSelect !== 0) {
			fetchGroupById(groupSelect).then(data => {
				setOneGroupData(data);
			})
			fetchUsersByGroupStatus(groupSelect, group_status).then(data => {
				setUsersData(data);
				setLoading(false);
			})
		} else {
			setUsersData([]);
			setLoading(true);
		}
	}, [groupSelect, view])

	useEffect(() => {
		setLoading(true);
		let group_status = view == 0 ? true : false
		searchUsersOnGroup(search, groupSelect, group_status).then(data => {
			setUsersData(data);
			if (groupSelect === 0) {
				return setLoading(true);
			}
			setLoading(false);
		});


	}, [useDebounced])


	const friendSkeletons = [
		{ id: 1 },
		{ id: 2 },
		{ id: 3 },
		{ id: 4 },
		{ id: 5 },
		{ id: 6 },
		{ id: 7 },
		{ id: 8 },
		{ id: 9 },
		{ id: 10 },
		{ id: 11 },
		{ id: 12 },
	]

	const onChangeGroupSelect = (e) => {
		setGroupSelect(Number(e.target.value));
	}

	const changeView = (view) => {
		setView(view);
	}

	const addStudent = async (id, id_user) => {
		await fetchAddStudent(id_user);
		const newData = usersData.filter(({ id }) => id !== id_user)
		setUsersData(newData)
	}

	const deleteStudent = async (id, id_user) => {
		await fetchDeleteStudent(id, id_user);
		const newData = usersData.filter(({ id }) => id !== id_user)
		setUsersData(newData)
	}

	let viewAll = !loading ? usersData.map(({ id }) => <FriendCard userId={id} key={id} options={view === 0 ? 1 : 2} onClickOne={() => addStudent(groupSelect, id)} onClickTwo={() => deleteStudent(groupSelect, id)} />) : friendSkeletons.map(({ id }) => <FriendSkeleton />)


	const saveButtonRenderer = tutorSelect === 0 && <div className="groupsManagement__settings-right-item-button" onClick={() => setModalActive(true)}>Создать</div>
	const createButtonRenderer = tutorSelect !== 0 && <div className="groupsManagement__settings-right-item-button groupsManagement__settings-right-item-button_save">Сохранить</div>
	return (
		<div className='container'>
			<CSSTransition
				in={modalActive}
				timeout={300}
				classNames="create-anim"
				mountOnEnter
				unmountOnExit
			>
				<div className="groupsManagement-modal" onClick={() => setModalActive(false)}>
					<div className="groupsManagement-modal__content" onClick={(e) => e.stopPropagation()}>
						<div className="groupsManagement-modal__close" onClick={() => setModalActive(false)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
								<path fillRule="evenodd" clipRule="evenodd" d="M0.402728 0.402728C0.939699 -0.134243 1.8103 -0.134243 2.34727 0.402728L5.5 3.55546L8.65273 0.402728C9.1897 -0.134243 10.0603 -0.134243 10.5973 0.402728C11.1342 0.939699 11.1342 1.8103 10.5973 2.34727L7.44454 5.5L10.5973 8.65273C11.1342 9.1897 11.1342 10.0603 10.5973 10.5973C10.0603 11.1342 9.1897 11.1342 8.65273 10.5973L5.5 7.44454L2.34727 10.5973C1.8103 11.1342 0.939699 11.1342 0.402728 10.5973C-0.134243 10.0603 -0.134243 9.1897 0.402728 8.65273L3.55546 5.5L0.402728 2.34727C-0.134243 1.8103 -0.134243 0.939699 0.402728 0.402728Z" fill="#97BCE6" />
							</svg>
						</div>


						<div className="groupsManagement-modal__item">
							<h2 className="groupsManagement-modal__item-title">Имя группы</h2>
							<input className="groupsManagement-modal__item-input" type="text" />
						</div>

						<div className="groupsManagement-modal__item">
							<h2 className="groupsManagement-modal__item-title">СП</h2>
							<select className="groupsManagement-modal__item-input" type="text">
								<option value="1">СП 10</option>
								<option value="2">СП 11</option>
								<option value="3">СП 12</option>
							</select>
						</div>

						<PrimaryButton>Создать</PrimaryButton>
					</div>
				</div>
			</CSSTransition>

			<div className="groupsManagement">
				<h1 className="groupsManagement__title">Управление группами</h1>
				<div className="groupsManagement__inner">
					<div className="groupsManagement__settings">
						<div className="groupsManagement__settings-left">
							<div className={view === 0 ? 'groupsManagement__settings-left-item' + ' ' + 'groupsManagement__settings-left-item_active' : 'groupsManagement__settings-left-item'} onClick={() => changeView(0)}>
								Все участники
							</div>
							<div className={view === 1 ? 'groupsManagement__settings-left-item' + ' ' + 'groupsManagement__settings-left-item_active' : 'groupsManagement__settings-left-item'} onClick={() => changeView(1)}>
								Заявки
							</div>

						</div>
						<div className="groupsManagement__settings-right">
							<div className="groupsManagement__settings-right-item">
								<select className='groupsManagement__settings-right-item-select' onChange={onChangeGroupSelect} value={groupSelect}>
									<option value="0">Выбор группы</option>
									{groupsData.map(item => {
										return (
											<option value={item.id} key={item.id}>{item.name}</option>
										)
									})}
								</select>
								<svg className='groupsManagement__settings-right-item-icon' xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
									<path d="M1 1L7 7L13 1" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
								</svg>

							</div>
							<div className="groupsManagement__settings-right-item">
								<select value={tutorSelect} onChange={(e) => setTutorSelect(Number(e.target.value))} className='groupsManagement__settings-right-item-select'>
									<option value="0">Определить куратора</option>
									{tutorsData.map(item => {
										return (
											<option key={item.id} value={item.id}>{item.full_name}</option>
										)
									})}
								</select>
								<svg className='groupsManagement__settings-right-item-icon' xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
									<path d="M1 1L7 7L13 1" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
								</svg>

							</div>
							<div className="groupsManagement__settings-right-item">
								<input type="text" className='groupsManagement__settings-right-item-search' placeholder='Поиск студента' onChange={(e) => { setLoading(true); setSearch(e.target.value) }} value={search} />
								<svg className='groupsManagement__settings-right-item-icon' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M15 15L12.2779 12.2778M14.2222 7.61111C14.2222 11.2623 11.2623 14.2222 7.61111 14.2222C3.95989 14.2222 1 11.2623 1 7.61111C1 3.95989 3.95989 1 7.61111 1C11.2623 1 14.2222 3.95989 14.2222 7.61111Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
							<SwitchTransition mode='out-in'>
								<CSSTransition nodeRef={nodeRef} key={tutorSelect} timeout={100} mountOnEnter unmountOnExit classNames="groupsManagement__anim-btn"  >
									<div className="groupsManagement__settings-right-item" ref={nodeRef}>
										{saveButtonRenderer}
										{createButtonRenderer}
									</div>
								</CSSTransition>
							</SwitchTransition>
						</div>
					</div>
					<div className="groupsManagement__wrapper">
						{viewAll}
					</div>
				</div>
			</div>

		</div>
	)
}

export default GroupsManagement