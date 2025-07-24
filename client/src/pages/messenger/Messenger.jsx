import React, { useState } from 'react'
import { createMessage } from '../../http/messageAPI'

const Messenger = () => {
  const [file, setFile] = useState(null)

  const selectFile = (e) => {
    setFile(e.target.files[0])
  }

  const sendMessage = async () => {
    const formData = new FormData()
    if (file) {
      formData.append('img', file)
    }
    await createMessage(formData)
    setFile(null)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={selectFile} />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default Messenger
