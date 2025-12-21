import { useEffect, useState } from 'react'
import { BoardPreview } from './BoardPreview'
import { loadBoards } from '../store/actions/board.actions'
import { useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function BoardList({ boards, addBoard, starToggle, changeColor }) {
  const starBoards = boards.filter(board => board.isStarred)
  const location = useLocation()
  const isCreateOpen = location.pathname === '/board'

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

        <section className="add-board-card-container">
          <Link
            className="add-board-card"
            to={isCreateOpen ? '/board/add-board' : '/board'}
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
