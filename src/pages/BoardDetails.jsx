import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router'

import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'
import { taskService } from '../services/task'
import { Loader } from '../cmps/Loader'

import {
  getCmdUpdateBoard,
  loadBoard,
  removeBoard,
  toggleBoardBgLoader,
  updateBoard,
  updateBoardOptimistic,
} from '../store/actions/board.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { store } from '../store/store'
import { SET_BOARD } from '../store/reducers/board.reducer'
import {
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EVENT_BOARD_UPDATED,
  socketService,
} from '../services/socket.service'

export function BoardDetails() {
  const board = useSelector(storeState => storeState.boardModule.board)
  const { boardId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      loadBoard(boardId)
    } catch (err) {
      console.log('err:', err)
    }

    return () => {
      store.dispatch({ type: SET_BOARD, board: '' })
    }
  }, [boardId])

  useEffect(() => {
    socketService.emit(SOCKET_EMIT_SET_TOPIC, boardId)

    socketService.on(SOCKET_EVENT_BOARD_UPDATED, board => {
      console.log('GOT from socket', board)
      dispatch(getCmdUpdateBoard(board))
    })
    return () => {
      socketService.off(SOCKET_EVENT_BOARD_UPDATED)
    }
    // socketService.on(SOCKET_EVENT_BOARD_UPDATED, board => {})
  }, [boardId])

  function onUpdateBoard(boardToEdit) {
    try {
      if (!boardToEdit.title) return
      updateBoard(boardToEdit)
    } catch (err) {
      console.log('err:', err)
    }
  }

  async function starToggle() {
    board.isStarred = !board.isStarred
    try {
      await updateBoard(board)
    } catch (err) {
      console.log(err)
    }
  }

  async function onRemoveBoard(boardId) {
    try {
      await removeBoard(boardId)
      showSuccessMsg('Board has been removed')
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
    } catch (err) {
      console.log(err)
    }
  }

  if (!board) return <Loader />
  if (!board.style)
    board.style = { background: { kind: 'solid', color: '#0079bf' } }
  if (!board.style.background)
    board.style.background = { kind: 'solid', color: '#0079bf' }

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
