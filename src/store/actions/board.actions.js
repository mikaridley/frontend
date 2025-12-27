import { boardService } from '../../services/board'
import { store } from '../store'
import {
  ADD_BOARD,
  ADD_RECENTLY_VIEWED_BOARD,
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

const { VITE_LOCAL } = import.meta.env

export async function loadBoards() {
  const { loggedinUser } = store.getState().userModule

  try {
    const boards = await boardService.query(loggedinUser._id)
    store.dispatch(getCmdSetBoards(boards))
  } catch (err) {
    console.log('Cannot load board', err)
    throw err
  } finally {
  }
}

export async function loadBoard(boardId) {
  try {
    const board = await boardService.getById(boardId)
    const { loggedinUser } = store.getState().userModule

    if (VITE_LOCAL !== 'true' && loggedinUser && board && board.members) {
      const isUserMember = board.members.some(
        member =>
          member._id === loggedinUser._id || member.id === loggedinUser._id
      )

      if (!isUserMember) {
        board.members.push(loggedinUser)
        await boardService.save(board)
      }
    }
    store.dispatch(getCmdSetBoard(board))
  } catch (err) {
    console.log('Cannot load board', err)
    throw err
  }
}

export async function loadFilteredBoards(filterBy) {
  try {
    const boards = await boardService.queryFiltered(filterBy)
    store.dispatch(getCmdSetFilteredBoards(boards))
    return boards
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
export function getCmdSetBoards(boards) {
  return {
    type: SET_BOARDS,
    boards,
  }
}
export function getCmdSetFilteredBoards(boards) {
  return {
    type: SET_FILTERED_BOARDS,
    boards,
  }
}
export function getCmdSetBoard(board) {
  return {
    type: SET_BOARD,
    board,
  }
}
export function getCmdRemoveBoard(boardId) {
  return {
    type: REMOVE_BOARD,
    boardId,
  }
}
export function getCmdAddBoard(board) {
  return {
    type: ADD_BOARD,
    board,
  }
}
export function getCmdUpdateBoard(board) {
  return {
    type: UPDATE_BOARD,
    board,
  }
}
export function getCmdGetPhotos(photos) {
  return {
    type: SET_PHOTOS,
    photos,
  }
}
export function getCmdBoardUndo() {
  return { type: BOARD_UNDO }
}
export function getCmdBoardBgLoader() {
  return { type: TOGGLE_BOARD_BG_LOADER }
}
export function getCmdSetFilterBt(filterBy) {
  return { type: SET_FILTER_BY, filterBy }
}
export function getCmdAddRecentlyViewedBoard(board) {
  return {
    type: ADD_RECENTLY_VIEWED_BOARD,
    board,
  }
}
