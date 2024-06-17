import React, { useContext, useEffect } from 'react';
import GroupCard from '../../components/groupCard/GroupCard';
import { Context } from '../../index';
import SpSelect from '../../components/spSelect/SpSelect';
import SpSelectMobile from '../../components/spSelectMobile/SpSelectMobile';
import { fetchGroups } from '../../http/groupsAPI';
import { observer } from 'mobx-react-lite';

const Groups = observer(() => {
    const { groups } = useContext(Context);

    useEffect(() => {
        document.title = "Группы";
        fetchGroups().then((data) => {

            groups.setGroups(data.rows.sort((a, b) => a.id > b.id ? 1 : -1));
        });
    }, []);

    return (
        <div className="container">
            <div className="groups">
                <div className="groups__title">Группы</div>
                <div className="groups__spSelect-wrapper">
                    <div className="groups__spSelect">
                        <SpSelect />
                    </div>
                    <div className="groups__spSelect_mobile">
                        <SpSelectMobile />
                    </div>
                </div>
                <div className="groups__wrapper">
                    {groups.groups.map((item) => (
                        <GroupCard group={item} key={item.id} />
                    ))}
                </div>
            </div>
        </div>
    );
});

export default Groups;
