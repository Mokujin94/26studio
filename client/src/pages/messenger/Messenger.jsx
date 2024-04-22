import React from 'react'
import MessengerSideBar from '../../components/messengerSideBar/MessengerSideBar'

function Messenger() {
	return (
		<div className='messenger'>
			<div className="container container_messenger">
				<div className="messenger__inner">
					<MessengerSideBar />
				</div>
			</div>
		</div>
	)
}

export default Messenger