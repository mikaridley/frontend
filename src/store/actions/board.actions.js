import { boardService } from '../../services/board'
import { store } from '../store'
import {
  ADD_BOARD,
  REMOVE_BOARD,
  SET_BOARD,
  SET_BOARDS,
  UPDATE_BOARD,
} from '../reducers/board.reducer'

export async function loadBoards(filterBy) {
  try {
    const boards = await boardService.query(filterBy)
    store.dispatch(getCmdSetBoards(boards))
  } catch (err) {
    console.log('Cannot load board', err)
    throw err
  }
}

export async function loadBoard(boardId) {
  try {
    const board = await boardService.getById(boardId)
    store.dispatch(getCmdSetBoard(board))
  } catch (err) {
    console.log('Cannot load board', err)
    throw err
  }
}

export async function removeBoard(boardId) {
  try {
    await boardService.remove(boardId)
    store.dispatch(getCmdRemoveBoard(boardId))
  } catch (err) {
    console.log('Cannot remove board', err)
    throw err
  }
}

export async function addBoard(board) {
  try {
    const savedBoard = await boardService.save(board)
    store.dispatch(getCmdAddBoard(savedBoard))
    return savedBoard
  } catch (err) {
    console.log('Cannot add board', err)
    throw err
  }
}

export async function updateBoard(board) {
  try {
    const savedBoard = await boardService.save(board)
    store.dispatch(getCmdUpdateBoard(savedBoard))
    return savedBoard
  } catch (err) {
    console.log('Cannot save board', err)
    throw err
  }
}

// export async function addBoardMsg(carId, txt) {
//     try {
//         const msg = await boardService.addBoardMsg(carId, txt)
//         store.dispatch(getCmdAddCarMsg(msg))
//         return msg
//     } catch (err) {
//         console.log('Cannot add board msg', err)
//         throw err
//     }
// }

// Command Creators:
function getCmdSetBoards(boards) {
  return {
    type: SET_BOARDS,
    boards,
  }
}
function getCmdSetBoard(board) {
  return {
    type: SET_BOARD,
    board,
  }
}
function getCmdRemoveBoard(boardId) {
  return {
    type: REMOVE_BOARD,
    boardId,
  }
}
function getCmdAddBoard(board) {
  return {
    type: ADD_BOARD,
    board,
  }
}
function getCmdUpdateBoard(board) {
  return {
    type: UPDATE_BOARD,
    board,
  }
}
// function getCmdAddCarMsg(msg) {
//     return {
//         type: ADD_CAR_MSG,
//         msg
//     }
// }

// unitTestActions()
// async function unitTestActions() {
//     await loadBoards()
//     await addBoard(carService.getEmptyCar())
//     await updateBoard({
//         _id: 'm1oC7',
//         vendor: 'Car-Good',
//     })
//     await removeBoard('m1oC7')
//     // TODO unit test addCarMsg
// }
