import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router'

import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'

import {
  loadBoard,
  removeBoard,
  updateBoard,
} from '../store/actions/board.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function BoardDetails() {
  const board = useSelector(storeState => storeState.boardModule.board)
  const { boardId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    try {
      loadBoard(boardId)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Could not load board')
    }
  }, [])

  function onUpdateBoard(title) {
    try {
      if (!title || board.title === title) return

      board.title = title
      updateBoard(board)
      showSuccessMsg('Updated')
    } catch (err) {
      console.log('err:', err)
      showErrorMsg(`Failed to update`)
    }
  }

  async function starToggle() {
    board.isStarred = !board.isStarred
    try {
      await updateBoard(board)
      showSuccessMsg('Board has been updated')
    } catch {
      showErrorMsg('Cannot update board')
    }
    console.log(board.isStarred)
  }

  async function onRemoveBoard(boardId) {
    try {
      await removeBoard(boardId)
      showSuccessMsg('Board removed')
      navigate(`/board`)
    } catch {
      showErrorMsg('Cannot remove board')
    }
  }

  if (!board) return
  const bg =
    board.style.background.kind === 'solid' ? 'backgroundColor' : 'background'

  return (
    <section
      className="board-details"
      style={
        board.style.background.kind === 'photo'
          ? { backgroundImage: `url(${board.style.background.color})` }
          : { [bg]: board.style.background.color }
      }
    >
      <BoardHeader
        board={board}
        onUpdateBoard={onUpdateBoard}
        starToggle={starToggle}
        onRemoveBoard={onRemoveBoard}
      />
      <GroupList members={board.members} />
      <Outlet />
    </section>
  )
}
