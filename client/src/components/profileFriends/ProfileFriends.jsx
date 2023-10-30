import React, { useState, useEffect } from 'react'
import FriendCard from '../friendCard/FriendCard'
import { fetchFriends } from '../../http/friendAPI';
import { useParams } from 'react-router-dom';

function ProfileFriends() {

  const {id} = useParams();

  const [friendData, setFriendData] = useState([])

  useEffect(() => {
    fetchFriends(id).then(data => setFriendData(data))
  }, []);
  return (
    <>
      {friendData && friendData.map(({id}) => <FriendCard userId={id} key={id}/>)}
    </>
  )
}

export default ProfileFriends