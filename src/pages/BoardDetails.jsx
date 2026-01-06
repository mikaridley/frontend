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
import { store } from '../store/store'
import { boardService } from '../services/board'
import { getValidValues } from '../services/util.service'
import { showErrorMsg } from '../services/event-bus.service'
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
    boardService.getSearchParams(searchParams))
  const [filteredBoard, setFilteredBoard] = useState(board)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      loadBoard(boardId)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Could not load board')
    }

    socketService.emit(SOCKET_EMIT_SET_TOPIC, boardId)
    socketService.on(SOCKET_EVENT_BOARD_UPDATED, board => {
      dispatch(getCmdUpdateBoard(board))
    })

    return () => {
      socketService.off(SOCKET_EVENT_BOARD_UPDATED)
      store.dispatch({ type: SET_BOARD, board: '' })
    }
  }, [boardId])

  useEffect(() => {
    setSearchParams(getValidValues(filterBy))
    if (!board) return
    setFilteredBoard(boardService.getFilteredBoard(board, filterBy))
  }, [filterBy, board])

  function onUpdateBoard(boardToEdit) {
    try {
      updateBoard(boardToEdit)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg(`Failed to update`)
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

  function onClearFilter() {
    setFilterBy(boardService.getDefaultTasksFilter())
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

  function getBg() {
    const kind = board.style.background.kind
    const color = board.style.background.color

    if (kind === 'photo') {
      return { backgroundImage: `url(${color})` }
    } else if (kind === 'solid') {
      return { backgroundColor: color }
    } else {
      return { background: color }
    }
  }

  if (!board) return <Loader />

  const bg = getBg()
  taskService.getLabels(board)

  if (!board) return <Loader />
  return (
    <section className="board-details" style={bg}>
      <BoardHeader
        board={board}
        onUpdateBoard={onUpdateBoard}
        onRemoveBoard={onRemoveBoard}
        changeBoardColor={changeBoardColor}
        onSetFilterBy={onSetFilterBy}
        filterBy={filterBy}
        onClearFilter={onClearFilter}
      />
      <GroupList filteredBoard={filteredBoard} onUpdateBoard={onUpdateBoard} />
      <Outlet />
    </section>
  )
}
