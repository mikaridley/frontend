import { useSelector } from 'react-redux'
import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
  addBoard,
  loadBoards,
  removeBoard,
  updateBoard,
} from '../store/actions/board.actions'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export function BoardIndex() {
  const boards = useSelector(storeState => storeState.boardModule.boards)
  const navigate = useNavigate()
  const [newBoardColor, setNewBoardColor] = useState('')

  useEffect(() => {
    loadBoards()
  }, [])

  async function _addBoard(ev, value) {
    ev.preventDefault()
    const boardToSave = boardService.getEmptyBoard()
    boardToSave.title = value
    boardToSave.style.backgroundImage = newBoardColor
    const savedBoard = await addBoard(boardToSave)
    navigate(`/board/${savedBoard._id}`)
  }

  async function _removeBoard(boardId) {
    try {
      await removeBoard(boardId)
      showSuccessMsg('Board removed')
    } catch {
      showErrorMsg('Cannot remove board')
    }
  }

  async function starToggle(board) {
    console.log(board.isStarred)
    board.isStarred = !board.isStarred
    try {
      await updateBoard(board)
      showSuccessMsg('Board has been updated')
    } catch {
      showErrorMsg('Cannot update board')
    }
  }

  function changeColor(color) {
    setNewBoardColor(color)
  }

  return (
    <section className="board-index">
      <BoardList
        boards={boards}
        addBoard={_addBoard}
        removeBoard={_removeBoard}
        starToggle={starToggle}
        changeColor={changeColor}
      />
    </section>
  )
}
