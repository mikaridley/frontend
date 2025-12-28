import { getDefaultFilter } from '../actions/board.actions'

export const SET_BOARDS = 'SET_BOARDS'
export const SET_FILTERED_BOARDS = 'SET_FILTERED_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const SET_PHOTOS = 'SET_PHOTOS'
export const BOARD_UNDO = 'BOARD_UNDO'
export const TOGGLE_BOARD_BG_LOADER = 'TOGGLE_BOARD_BG_LOADER'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const ADD_RECENTLY_VIEWED_BOARD = 'ADD_RECENTLY_VIEWED_BOARD'

const initialState = {
  boards: [],
  filteredBoards: [],
  board: null,
  backgroundPhotos: [],
  lastBoard: [],
  backgroundLoader: false,
  filterBy: getDefaultFilter(),
  recentlyViewedBoards: [],
}

export function boardReducer(state = initialState, action) {
  var newState = state
  var boards
  switch (action.type) {
    case SET_BOARDS:
      newState = { ...state, boards: action.boards }
      break
    case SET_FILTERED_BOARDS:
      newState = { ...state, filteredBoards: action.boards }
      break
    case SET_BOARD:
      newState = { ...state, board: action.board }
      break
    case REMOVE_BOARD:
      const lastRemovedBoard = state.boards.find(
        board => board._id === action.boardId
      )
      boards = state.boards.filter(board => board._id !== action.boardId)
      newState = { ...state, boards, lastRemovedBoard }
      break
    case ADD_BOARD:
      newState = { ...state, boards: [...state.boards, action.board] }
      break
    case UPDATE_BOARD:
      if (action.isArchive) var lastBoard = { ...action.prevBoard }
      boards = state.boards.map(board =>
        board._id === action.board._id ? action.board : board
      )
      newState = {
        ...state,
        boards,
        board:
          state.board && state.board._id === action.board._id
            ? action.board
            : state.board,
        lastBoard,
      }
      break
    case SET_PHOTOS:
      newState = { ...state, backgroundPhotos: action.photos }
      break
    case BOARD_UNDO:
      console.log('state.lastBoard', state.lastBoard)
      return {
        ...state,
        board: state.lastBoard,
      }
    case TOGGLE_BOARD_BG_LOADER:
      return {
        ...state,
        backgroundLoader: !state.backgroundLoader,
      }
    case ADD_RECENTLY_VIEWED_BOARD:
      const filteredBoards = state.recentlyViewedBoards.filter(
        board => board._id !== action.board._id
      )
      newState = {
        ...state,
        recentlyViewedBoards: [action.board, ...filteredBoards],
      }
      break
    case SET_FILTER_BY:
      return {
        ...state,
        filterBy: { ...state.filterBy, ...action.filterBy },
      }
    default:
      return state
  }
  return newState
}
