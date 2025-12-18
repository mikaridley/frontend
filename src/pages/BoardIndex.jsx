import { useSelector } from 'react-redux'
import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
  addBoard,
  loadBoards,
  removeBoard,
} from '../store/actions/board.actions'
import { useEffect } from 'react'

export function BoardIndex() {
  const boards = useSelector(storeState => storeState.boardModule.boards)

  useEffect(() => {
    loadBoards()
  }, [])

  async function onAddBoard(ev, value) {
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

  return (
    <section className="board-index">
      <BoardList
        boards={boards}
        onAddBoard={onAddBoard}
        removeBoard={_removeBoard}
      />
    </section>
  )
}
