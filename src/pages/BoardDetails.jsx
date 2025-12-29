import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { BoardHeader } from '../cmps/BoardHeaderCmps/BoardHeader'
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
import { boardService } from '../services/board'
import { getValidValues } from '../services/util.service'
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

  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(
    boardService.getSearchParams(searchParams)
  )
  const [filteredBoard, setFilteredBoard] = useState(board)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      loadBoard(boardId)
    } catch (err) {
      console.log('err:', err)
    }
  }, [boardId])

  useEffect(() => {
    setSearchParams(getValidValues(filterBy))
    if (!board) return
    setFilteredBoard(boardService.getFilteredBoard(board, filterBy))
  }, [filterBy, board])

  useEffect(() => {
    socketService.emit(SOCKET_EMIT_SET_TOPIC, boardId)

    socketService.on(SOCKET_EVENT_BOARD_UPDATED, board => {
      dispatch(getCmdUpdateBoard(board))
    })
    return () => {
      socketService.off(SOCKET_EVENT_BOARD_UPDATED)
      store.dispatch({ type: SET_BOARD, board: '' })
    }
  }, [boardId])

  function onUpdateBoard(boardToEdit) {
    if (!boardToEdit.title || !/\S/.test(boardToEdit.title).length) return
    
    try {
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
      navigate(`/board`)
    } catch {
      showErrorMsg('Cannot remove board')
    }
  }

  function onSetFilterBy(newFilterBy) {
    setFilterBy(filterBy => ({ ...filterBy, ...newFilterBy }))
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
  const bg =
    board.style.background.kind === 'solid' ? 'backgroundColor' : 'background'

  taskService.getLabels(board)

  if (!board) return <Loader />
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
        onSetFilterBy={onSetFilterBy}
        filterBy={filterBy}
      />
      <GroupList board={filteredBoard} />
      <Outlet />
    </section>
  )
}
