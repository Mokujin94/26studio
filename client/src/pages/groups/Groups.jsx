import React from 'react'
import GroupCard from '../../components/groupCard/GroupCard'
import { Context } from '../../index'
import SpSelect from '../../components/spSelect/SpSelect'

function Groups() {
  
  return (
    <div className="container">
      <div className="groups">
        <div className="title">Группы</div>
        <div className="spSelect-wrapper">
          <SpSelect/>
        </div>
        <div className="groups-wrapper">
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
        </div>
     
      </div>
    </div>
  )
}

export default Groups