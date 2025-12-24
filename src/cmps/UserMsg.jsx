import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'
import {
  socketService,
  SOCKET_EVENT_REVIEW_ABOUT_YOU,
} from '../services/socket.service'
import closeImg from '../assets/img/close.svg'
import userMessageImg from '../assets/img/user-message.svg'

export function UserMsg() {
  const [msg, setMsg] = useState(null)
  const timeoutIdRef = useRef()

  useEffect(() => {
    const unsubscribe = eventBus.on('show-msg', msg => {
      setMsg(msg)
      if (timeoutIdRef.current) {
        timeoutIdRef.current = null
        clearTimeout(timeoutIdRef.current)
      }
      timeoutIdRef.current = setTimeout(closeMsg, 3000)
    })

    socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
      showSuccessMsg(`New review about me ${review.txt}`)
    })

    return () => {
      unsubscribe()
      socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
    }
  }, [])

  function closeMsg() {
    setMsg(null)
  }

  function msgClass() {
    return msg ? 'visible' : ''
  }

  function onUndoBoard() {
    // undoBoard()
  }

  return (
    <section className={`user-msg ${msg?.type} ${msgClass()}`}>
      <img className="user-msg-icon" src={userMessageImg} />
      {msg?.txt}
      <img className="user-msg-close" src={closeImg} onClick={closeMsg} />
      <button onClick={onUndoBoard}>Undo</button>
    </section>
  )
}
