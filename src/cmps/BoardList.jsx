import { useEffect } from 'react'
import { BoardPreview } from './BoardPreview'
import { loadBoards } from '../store/actions/board.actions'
import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'

export function BoardList({
  boards,
  addBoard,
  removeBoard,
  starToggle,
  changeColor,
}) {
  const starBoards = boards.filter(board => board.isStarred)
  return (
    <section className="board-list">
      <h2 className="star-boards-header">Starred boards</h2>
      <section className="star-boards">
        {starBoards.map(board => {
          return (
            <BoardPreview
              key={board._id}
              board={board}
              removeBoard={removeBoard}
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
          <Outlet context={{ addBoard, changeColor }} />
        </section>
      </section>
    </section>
  )
}
