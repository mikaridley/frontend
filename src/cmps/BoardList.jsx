import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BoardPreview } from './BoardPreview'
import { loadBoards } from '../store/actions/board.actions'
import { useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function BoardList({ boards, addBoard, starToggle, changeColor }) {
  const starBoards = boards.filter(board => board.isStarred)
  const recentlyViewedBoards = useSelector(
    storeState => storeState.boardModule.recentlyViewedBoards
  )
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
    const padding = 8

    /* ---------- X AXIS ---------- */
    // Prefer RIGHT
    let left = cardRect.right + padding
    let dir = 'right'

    // If no space on the right → move LEFT
    if (left + popupRect.width > window.innerWidth - padding) {
      left = cardRect.left - popupRect.width - padding
      dir = 'left'
    }

    // Final safety clamp
    if (left < padding) left = padding

    /* ---------- Y AXIS ---------- */
    // Center vertically
    let top = cardRect.top + cardRect.height / 2 - popupRect.height / 2

    // Clamp inside viewport
    if (top < padding) top = padding
    if (top + popupRect.height > window.innerHeight - padding) {
      top = window.innerHeight - popupRect.height - padding
    }

    popupRef.current.style.left = `${left}px`
    popupRef.current.style.top = `${top}px`
    setDirection(dir)
  }, [isCreateOpen])

  return (
    <section className="board-list">
      {starBoards.length > 0 && (
        <>
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
        </>
      )}

      {recentlyViewedBoards.length > 0 && (
        <>
          <h2 className="recently-viewed-boards-header">Recently viewed</h2>
          <section className="recently-viewed-boards">
            {recentlyViewedBoards.slice(0, 4).map(board => {
              return (
                <BoardPreview
                  key={board._id}
                  board={board}
                  starToggle={starToggle}
                />
              )
            })}
          </section>
        </>
      )}

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
