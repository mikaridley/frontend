import { Outlet } from 'react-router'
import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board'
import { addBoard } from '../store/actions/board.actions'

export function BoardIndex() {
  async function onAddBoard(ev, value) {
    ev.preventDefault()
    const boardToSave = boardService.getEmptyBoard()
    boardToSave.title = value
    await addBoard(boardToSave)
  }

  return (
    <section className="board-index">
      <BoardList onAddBoard={onAddBoard} />
    </section>
  )
}
