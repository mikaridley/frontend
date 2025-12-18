import { useNavigate } from 'react-router'

export function BoardPreview({ board }) {
  const navigate = useNavigate()

  function onOpenBoard() {
    navigate(`/board/${board._id}`)
  }
  return (
    <section
      onClick={onOpenBoard}
      className="board-preview"
      style={{ '--board-name': `"${board.title}"` }}
    ></section>
  )
}
