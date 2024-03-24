import React, { useContext, useEffect, useState } from 'react';

import './group.scss';
import FriendCard from '../../components/friendCard/FriendCard';
import { fetchGroupById } from '../../http/groupsAPI';
import { useParams } from 'react-router-dom';
import { Context } from '../..';

function Group() {
	const { groups } = useContext(Context);
	const [groupData, setGroupData] = useState({});
	const [groupDataUsers, setGroupDataUsers] = useState([])

	const { id } = useParams();

	useEffect(() => {
		fetchGroupById(id).then((data) => {
			console.log(data);
			const dataUsers = data.users.filter(item => item.group_status)
			console.log(dataUsers);
			setGroupDataUsers(dataUsers)
			setGroupData((item) => (item = data))
		});

	}, []);

	return (
		<div className="group">
			<div className="container">
				<h2 className="group__title">{groupData.name}</h2>
				<div className="group__content">
					<div className="group__content-curator">
						<h3 className="group__content-title group__content-title_color">Куратор</h3>
						<div className="group__content-wrapper">
							{
								groupDataUsers.filter(({ roleId }) => {
									return roleId === 2;
								}).map(({ id }) => <FriendCard userId={id} key={id} />)
							}
						</div>
					</div>
					<div className="group__content-students">
						<h3 className="group__content-title">Студенты</h3>
						<div className="group__content-wrapper">
							{
								groupDataUsers.length
									? groupDataUsers.filter(({ roleId }) => {
										return roleId === 1;
									}).map(({ id }) => <FriendCard userId={id} key={id} />)
									: "В этой группе нет участников"
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Group;
