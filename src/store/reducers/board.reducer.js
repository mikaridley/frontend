export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
// export const ADD_CAR_MSG = 'ADD_CAR_MSG'

const initialState = {
  boards: [],
  board: null,
}

export function boardReducer(state = initialState, action) {
  var newState = state
  var boards
  switch (action.type) {
    case SET_BOARDS:
      newState = { ...state, boards: action.boards }
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
      boards = state.boards.map(board =>
        board._id === action.board._id ? action.board : board
      )
      newState = { ...state, boards }
      break
    // case ADD_CAR_MSG:
    //   if (action.msg && state.car) {
    //     newState = {
    //       ...state,
    //       car: { ...state.car, msgs: [...(state.car.msgs || []), action.msg] },
    //     }
    //     break
    //   }
    default:
  }
  return newState
}

// unitTestReducer()

// function unitTestReducer() {
//   var state = initialState
//   const car1 = {
//     _id: 'b101',
//     vendor: 'Car ' + parseInt('' + Math.random() * 10),
//     speed: 12,
//     owner: null,
//     msgs: [],
//   }
//   const car2 = {
//     _id: 'b102',
//     vendor: 'Car ' + parseInt('' + Math.random() * 10),
//     speed: 13,
//     owner: null,
//     msgs: [],
//   }

//   state = boardReducer(state, { type: SET_BOARDS, cars: [car1] })
//   console.log('After SET_CARS:', state)

//   state = boardReducer(state, { type: ADD_BOARD, car: car2 })
//   console.log('After ADD_CAR:', state)

//   state = boardReducer(state, {
//     type: UPDATE_BOARD,
//     car: { ...car2, vendor: 'Good' },
//   })
//   console.log('After UPDATE_CAR:', state)

//   state = boardReducer(state, { type: REMOVE_BOARD, carId: car2._id })
//   console.log('After REMOVE_CAR:', state)

//   state = boardReducer(state, { type: SET_BOARD, car: car1 })
//   console.log('After SET_CAR:', state)

//   const msg = {
//     id: 'm' + parseInt('' + Math.random() * 100),
//     txt: 'Some msg',
//     by: { _id: 'u123', fullname: 'test' },
//   }
//   state = boardReducer(state, { type: ADD_CAR_MSG, carId: car1._id, msg })
//   console.log('After ADD_CAR_MSG:', state)
// }
