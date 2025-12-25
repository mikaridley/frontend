import { boardService } from '../../services/board'
import { store } from '../store'
import {
  ADD_BOARD,
  BOARD_UNDO,
  REMOVE_BOARD,
  SET_BOARD,
  SET_BOARDS,
  SET_FILTER_BY,
  SET_FILTERED_BOARDS,
  SET_PHOTOS,
  TOGGLE_BOARD_BG_LOADER,
  UPDATE_BOARD,
} from '../reducers/board.reducer'

import { LOADING_START, LOADING_DONE } from '../reducers/system.reducer'

const { VITE_LOCAL } = import.meta.env

export async function loadBoards() {
  const { loggedinUser } = store.getState().userModule
  store.dispatch({ type: LOADING_START })

  try {
    const boards = await boardService.query(loggedinUser._id)
    store.dispatch(getCmdSetBoards(boards))
  } catch (err) {
    console.log('Cannot load board', err)
    throw err
  } finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

// export async function loadBoards() {
//   store.dispatch({ type: LOADING_START })

//   try {
//     const boards = await boardService.query()
//     store.dispatch(getCmdSetBoards(boards))
//     return boards
//   } catch (err) {
//     console.log('Cannot load board', err)
//     throw err
//   } finally {
//     store.dispatch({ type: LOADING_DONE })
//   }
// }

export async function loadFilteredBoards(filterBy) {
  store.dispatch({ type: LOADING_START })

  try {
    const boards = await boardService.queryFiltered(filterBy)
    store.dispatch(getCmdSetFilteredBoards(boards))
    return boards
  } catch (err) {
    console.log('Cannot load board', err)
    throw err
  } finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

export async function loadBoard(boardId) {
  store.dispatch({ type: LOADING_START })

  try {
    const board = await boardService.getById(boardId)
    const { loggedinUser } = store.getState().userModule
    
    // automatically add logged-in user to board members if not already present (remote only)
    // in local mode, this behavior is handled differently
    if (VITE_LOCAL !== 'true' && loggedinUser && board && board.members) {
      const isUserMember = board.members.some(member => 
        member._id === loggedinUser._id || member.id === loggedinUser._id
      )
      
      if (!isUserMember) {
        board.members.push(loggedinUser)
        // save the updated board to backend
        await boardService.save(board)
      }
    }
    
    store.dispatch(getCmdSetBoard(board))
  } catch (err) {
    console.log('Cannot load board', err)
    throw err
  } finally {
    store.dispatch({ type: LOADING_DONE })
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
    console.log('Board has been saved')
    return savedBoard
  } catch (err) {
    console.log('Cannot save board', err)
    throw err
  }
}

export async function updateBoardOptimistic(board) {
  store.dispatch(getCmdUpdateBoard(board))

  try {
    const savedBoard = await boardService.save(board)
    console.log('Board has been saved')
    return savedBoard
  } catch (err) {
    store.dispatch(getCmdBoardUndo())
    console.log('Cannot save board', err)
    throw err
  }
}

export async function getPhotos() {
  try {
    const photos = await boardService.getBoardBackgrounds()
    store.dispatch(getCmdGetPhotos(photos))
    return photos
  } catch (err) {
    console.error('Failed to set photos', err)
    throw err
  }
}

export function getColorsBg() {
  return boardService.getBackgrounds()
}

export function toggleBoardBgLoader() {
  store.dispatch(getCmdBoardBgLoader())
}

export function getDefaultFilter() {
  return { title: '' }
}

export function setFilterBy(filterBy) {
  store.dispatch(getCmdSetFilterBt(filterBy))
}

// Command Creators:
function getCmdSetBoards(boards) {
  return {
    type: SET_BOARDS,
    boards,
  }
}
function getCmdSetFilteredBoards(boards) {
  return {
    type: SET_FILTERED_BOARDS,
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
function getCmdGetPhotos(photos) {
  return {
    type: SET_PHOTOS,
    photos,
  }
}
function getCmdBoardUndo() {
  return { type: BOARD_UNDO }
}
function getCmdBoardBgLoader() {
  return { type: TOGGLE_BOARD_BG_LOADER }
}
function getCmdSetFilterBt(filterBy) {
  return { type: SET_FILTER_BY, filterBy }
}

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
