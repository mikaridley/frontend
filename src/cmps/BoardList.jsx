import { useEffect } from 'react'
import { BoardPreview } from './BoardPreview'
import { loadBoards } from '../store/actions/board.actions'
import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'

export function BoardList({ onAddBoard }) {
  const boards = useSelector(storeState => storeState.boardModule.boards)

  useEffect(() => {
    loadBoards()
  }, [])

  return (
    <section className="board-list">
      {boards.map(board => {
        return <BoardPreview key={board._id} board={board} />
      })}
      <section className="add-board-card-container">
        <Link
          className="add-board-card"
          to="/board/add-board"
          state={{ origin: 'board-list' }}
        >
          Create new board
        </Link>
        <Outlet context={{ onAddBoard }} />
      </section>
    </section>
  )
}
