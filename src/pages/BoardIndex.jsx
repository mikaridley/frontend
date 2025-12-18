import { Outlet } from 'react-router'
import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board'
import { addBoard } from '../store/actions/board.actions'

export function BoardIndex() {
  async function onAddBoard(ev, value) {
    ev.preventDefault()
    console.log(value)
    const boardToSave = boardService.getEmptyBoard()
    boardToSave.title = value
    console.log(boardToSave)
    // const savedBoard = await addBoard(boardToSave)
    // console.log(savedBoard)
  }

  return (
    <section className="board-index">
      <BoardList onAddBoard={onAddBoard} />
    </section>
  )
}
