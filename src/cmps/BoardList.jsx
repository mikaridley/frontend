import { useEffect } from 'react'
import { BoardPreview } from './BoardPreview'
import { loadBoards } from '../store/actions/board.actions'
import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'

export function BoardList({ boards, addBoard, removeBoard, starToggle }) {
  return (
    <section className="board-list">
      {boards.map(board => {
        return (
          <BoardPreview
            key={board._id}
            board={board}
            removeBoard={removeBoard}
            starToggle={starToggle}
          />
        )
      })}
      <section className="add-board-card-container">
        <Link
          className="add-board-card"
          to="/board/add-board"
          state={{ origin: 'board-list' }}
        >
          Create new board
        </Link>
        <Outlet context={{ addBoard }} />
      </section>
    </section>
  )
}
