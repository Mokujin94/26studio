import React from 'react';
import GroupCard from '../../components/groupCard/GroupCard';
import { Context } from '../../index';
import SpSelect from '../../components/spSelect/SpSelect';
import SpSelectMobile from '../../components/spSelectMobile/SpSelectMobile';

function Groups() {
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
          <GroupCard />
          <GroupCard />
          <GroupCard />
          <GroupCard />
          <GroupCard />
          <GroupCard />
          <GroupCard />
          <GroupCard />
        </div>
      </div>
    </div>
  );
}

export default Groups;
