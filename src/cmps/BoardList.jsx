import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BoardPreview } from './BoardPreview'
import { loadBoards } from '../store/actions/board.actions'
import { useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function BoardList({ boards, addBoard, starToggle, changeColor }) {
  const starBoards = boards.filter(board => board.isStarred)
  const location = useLocation()
  const isCreateOpen = location.pathname === '/board/add-board'

  const cardRef = useRef(null)
  const popupRef = useRef(null)
  const [direction, setDirection] = useState('right')

  useLayoutEffect(() => {
    if (!isCreateOpen) return
    if (!cardRef.current || !popupRef.current) return

    const cardRect = cardRef.current.getBoundingClientRect()
    const popupRect = popupRef.current.getBoundingClientRect()

    const spaceRight = window.innerWidth - cardRect.right
    const spaceLeft = cardRect.left

    if (spaceRight < popupRect.width && spaceLeft > popupRect.width) {
      setDirection('left')
    } else {
      setDirection('right')
    }
  }, [isCreateOpen])

  return (
    <section className="board-list">
      <h2 className="star-boards-header">Starred boards</h2>
      <section className="star-boards">
        {starBoards.map(board => {
          return (
            <BoardPreview
              key={board._id}
              board={board}
              starToggle={starToggle}
            />
          )
        })}
      </section>
      <h2>Boards</h2>
      <section className="not-star-boards">
        {boards.map(board => {
          return (
            <BoardPreview
              key={board._id}
              board={board}
              starToggle={starToggle}
            />
          )
        })}

        <section className="add-board-card-container" ref={cardRef}>
          <Link
            className="add-board-card"
            to={isCreateOpen ? '/board' : '/board/add-board'}
            state={{ origin: 'board-list' }}
          >
            Create new board
          </Link>

          <div className={`add-board-outlet ${direction}`}>
            <Outlet context={{ addBoard, changeColor, popupRef }} />
          </div>
        </section>
      </section>
    </section>
  )
}
