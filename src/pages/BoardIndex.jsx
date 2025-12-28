import { useDispatch, useSelector } from 'react-redux'
import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board'
import {
  addBoard,
  loadBoards,
  updateBoard,
} from '../store/actions/board.actions'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Loader } from '../cmps/Loader'
import {
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EVENT_BOARD_ADDED,
  SOCKET_EVENT_BOARD_REMOVED,
} from '../services/socket.service'
import {
  getCmdAddBoard,
  getCmdRemoveBoard,
} from '../store/actions/board.actions'
import { AiChat } from '../cmps/AiChat'
import { getRandomColor, makeId } from '../services/util.service'

export function BoardIndex() {
  const boards = useSelector(storeState => storeState.boardModule.boards)
  const loggedinUser = useSelector(
    storeState => storeState.userModule.loggedinUser
  )
  const navigate = useNavigate()
  const [newBoardColor, setNewBoardColor] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    loadBoards()

    // socketService.emit(SOCKET_EMIT_SET_TOPIC, worspace._id)

    // socketService.on(SOCKET_EVENT_BOARD_ADDED, board => {
    //   console.log('GOT from socket', board)
    //   dispatch(getCmdAddBoard(board))
    // })

    // socketService.on(SOCKET_EVENT_BOARD_REMOVED, boardId => {
    //   console.log('GOT from socket', boardId)
    //   dispatch(getCmdRemoveBoard(boardId))
    // })
  }, [])

  async function _addBoard(ev, value) {
    ev.preventDefault()
    const boardToSave = boardService.getEmptyBoard()
    boardToSave.members = [loggedinUser]
    boardToSave.title = value
    boardToSave.style.background = {
      color: newBoardColor.color || '#0079bf',
      kind: newBoardColor.kind || 'solid',
    }
    console.log(loggedinUser)
    if (loggedinUser)
      boardToSave.createdBy = {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
        imgUrl: loggedinUser.imgUrl,
      }
    const savedBoard = await addBoard(boardToSave)
    navigate(`/board/${savedBoard._id}`)
  }

  async function addAiBoard(board) {
    const boardObject = JSON.parse(board)
    console.log(boardObject)

    const boardToSave = boardService.getEmptyBoard()
    boardToSave.members = [loggedinUser]
    boardToSave.title = boardObject.title
    boardToSave.style.background = getRandomColor()

    if (loggedinUser)
      boardToSave.createdBy = {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
        imgUrl: loggedinUser.imgUrl,
      }

    if (boardObject.groups && boardObject.groups.length) {
      boardToSave.groups = boardObject.groups.map(group => ({
        id: makeId(), // generate unique ID for the group
        title: group.title,
        tasks: group.tasks.map(task => ({
          id: makeId(), // generate unique ID for each task
          title: task.title,
        })),
      }))
    }

    const savedBoard = await addBoard(boardToSave)
    navigate(`/board/${savedBoard._id}`)
  }

  async function starToggle(board) {
    board.isStarred = !board.isStarred
    try {
      await updateBoard(board)
    } catch (err) {
      console.log(err)
    }
  }

  function changeColor({ color, kind }) {
    setNewBoardColor({ color, kind })
  }

  if (!boards) return <Loader />
  return (
    <section className="board-index">
      <BoardList
        boards={boards}
        addBoard={_addBoard}
        starToggle={starToggle}
        changeColor={changeColor}
      />
      <AiChat addAiBoard={addAiBoard} />
    </section>
  )
}
