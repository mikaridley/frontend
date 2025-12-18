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
import { useEffect } from 'react'

export function BoardIndex() {
  const boards = useSelector(storeState => storeState.boardModule.boards)

  useEffect(() => {
    loadBoards()
  }, [])

  async function _addBoard(ev, value) {
    ev.preventDefault()
    const boardToSave = boardService.getEmptyBoard()
    boardToSave.title = value
    await addBoard(boardToSave)
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

  return (
    <section className="board-index">
      <BoardList
        boards={boards}
        addBoard={_addBoard}
        removeBoard={_removeBoard}
        starToggle={starToggle}
      />
    </section>
  )
}
