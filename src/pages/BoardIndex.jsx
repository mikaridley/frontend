import { useSelector } from 'react-redux'
import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
  addBoard,
  loadBoards,
  updateBoard,
} from '../store/actions/board.actions'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Loader } from '../cmps/Loader'
import { userService } from '../services/user'

export function BoardIndex() {
  const boards = useSelector(storeState => storeState.boardModule.boards)
  const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
  const navigate = useNavigate()
  const [newBoardColor, setNewBoardColor] = useState('')

  useEffect(() => {
    loadBoards()
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
    const savedBoard = await addBoard(boardToSave)
    navigate(`/board/${savedBoard._id}`)
  }

  async function starToggle(board) {
    board.isStarred = !board.isStarred
    try {
      await updateBoard(board)
      showSuccessMsg('Board has been updated')
    } catch {
      showErrorMsg('Cannot update board')
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
    </section>
  )
}
