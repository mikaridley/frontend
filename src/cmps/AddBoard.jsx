import { MiniBoardPreview } from './addBoardCmps/MiniBoardPreview.jsx'
import { BackgroundContainer } from './addBoardCmps/BackgroundContainer.jsx'
import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'

export function AddBoard() {
  const { onAddBoard } = useOutletContext()
  const [boardName, setBoardName] = useState('')

  function handleChange({ target }) {
    let value = target.value
    setBoardName(value)
  }

  return (
    <section className="add-board">
      <Link className="close-add-board" to="/board">
        X
      </Link>
      <h2>Create board</h2>
      <MiniBoardPreview />
      <BackgroundContainer />
      <form onSubmit={ev => onAddBoard(ev, boardName)}>
        <label htmlFor="boardTitle">Board title</label>
        <input
          onChange={handleChange}
          name="boardName"
          required
          id="boardTitle"
          type="text"
          value={boardName}
        />
        <button>Create</button>
      </form>
    </section>
  )
}
