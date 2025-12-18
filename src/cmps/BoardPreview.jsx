import { useNavigate } from 'react-router'
import starImg from '../assets/img/star.svg'

export function BoardPreview({ board, removeBoard }) {
  const navigate = useNavigate()

  function onOpenBoard() {
    navigate(`/board/${board._id}`)
  }

  function onRemoveBoard(ev) {
    ev.stopPropagation()
    removeBoard(board._id)
  }
  return (
    <section
      onClick={onOpenBoard}
      className="board-preview"
      style={{ '--board-name': `"${board.title}"` }}
    >
      <img className="star-board" src={starImg} />
      <p onClick={ev => onRemoveBoard(ev)}>Delete</p>
    </section>
  )
}
