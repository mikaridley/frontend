import { useNavigate } from 'react-router'

import starImg from '../assets/img/star.svg'
import fullStarImg from '../assets/img/full-star.svg'

export function BoardPreview({ board, starToggle }) {
  const navigate = useNavigate()

  function onOpenBoard() {
    navigate(`/board/${board._id}`)
  }

  function onToggleStar(ev) {
    ev.stopPropagation()
    starToggle(board)
  }

  const { style } = board
  const kind =
    style.background.kind === 'solid' ? 'backgroundColor' : 'background'

  return (
    <section
      onClick={onOpenBoard}
      className="board-preview"
      style={{
        '--board-name': `"${board.title}"`,
        ...(style.background.kind === 'photo'
          ? { backgroundImage: `url(${style.background.color})` }
          : { [kind]: style.background.color }),
      }}
    >
      <img
        onClick={onToggleStar}
        className={`star-toggle ${board.isStarred ? 'starred-board' : ''}`}
        src={!board.isStarred ? starImg : fullStarImg}
      />
    </section>
  )
}
