import React from 'react'
import MessengerSideBar from '../../components/messengerSideBar/MessengerSideBar'
import MessengerContent from '../../components/messengerContent/MessengerContent'
import { useLocation } from 'react-router-dom'
import { fetchChat } from '../../http/chatsAPI';

function Messenger() {

	return (
		<div className='messenger'>
			<div className="messenger__inner">
				<MessengerSideBar />
				<MessengerContent />
			</div>
		</div>
	)
}

export default Messenger