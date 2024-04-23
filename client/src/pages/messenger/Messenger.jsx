import React from 'react'
import MessengerSideBar from '../../components/messengerSideBar/MessengerSideBar'
import MessengerContent from '../../components/messengerContent/MessengerContent'

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