import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router'

import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'
import { taskService } from '../services/task/task.service.local'
import { Loader } from '../cmps/Loader'

import {
  loadBoard,
  removeBoard,
  toggleBoardBgLoader,
  updateBoard,
  updateBoardOptimistic,
} from '../store/actions/board.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { store } from '../store/store'
import { SET_BOARD } from '../store/reducers/board.reducer'

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

    return () => {
      store.dispatch({ type: SET_BOARD, board: '' })
    }
  }, [])

  function onUpdateBoard(boardToEdit) {
    try {
      if (!boardToEdit.title || board.title === boardToEdit.title) return

      updateBoard(boardToEdit)
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

  async function changeBoardColor({ color, kind }) {
    toggleBoardBgLoader()
    const updatedBoard = {
      ...board,
      style: {
        ...board.style,
        background: { color, kind },
      },
    }
    try {
      await updateBoardOptimistic(updatedBoard)
      toggleBoardBgLoader()
    } catch {
      showErrorMsg('Cannot update board')
    }
  }

  if (!board) return <Loader />
  const bg =
    board.style.background.kind === 'solid' ? 'backgroundColor' : 'background'
  taskService.getLabels(board)

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
        changeBoardColor={changeBoardColor}
      />
      <GroupList />
      <Outlet />
    </section>
  )
}
