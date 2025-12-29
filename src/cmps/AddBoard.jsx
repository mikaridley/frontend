import closeImg from '../assets/img/close.svg'
import { BackgroundContainer } from './addBoardCmps/BackgroundContainer.jsx'
import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext, useLocation } from 'react-router-dom'

export function AddBoard() {
  const { addBoard, changeColor, popupRef } = useOutletContext()
  const [boardName, setBoardName] = useState('')
  const location = useLocation()
  const origin = location.state?.origin || 'board-list'
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleChange({ target }) {
    let value = target.value
    setBoardName(value)
  }

  return (
    <section
      ref={popupRef}
      className={`add-board ${
        origin === 'header' ? 'from-header' : 'from-list'
      }`}
    >
      <header className="add-board-header">
        <h2>Create board</h2>
        <Link className="close-add-board" to="/board">
          <img src={closeImg} />
        </Link>
      </header>

      <BackgroundContainer changeColor={changeColor} isForPreview={true} />
      <form onSubmit={ev => addBoard(ev, boardName)}>
        <label htmlFor="boardTitle">Board title</label>
        <input
          onChange={handleChange}
          name="boardName"
          required
          id="boardTitle"
          type="text"
          value={boardName}
          ref={inputRef}
        />
        <button disabled={!boardName.trim()}>Create</button>
      </form>
    </section>
  )
}
