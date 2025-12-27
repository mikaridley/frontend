import { store } from '../store'
import { taskService } from '../../services/task'
import { updateBoard } from './board.actions'
import { UPDATE_BOARD } from '../reducers/board.reducer'

export async function addTask(board, group, task) {
  try {
    const updatedBoard = await taskService.addTask(board, group, task)
    // Update store immediately for optimistic UI update
    store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
    // Persist to backend
    await updateBoard(updatedBoard)
    return updatedBoard
  } catch (err) {
    console.log('err:', err)
    throw err
  }
}

export async function updateTask(board, groupId, taskId, changes) {
  try {
    const updatedBoard = await taskService.updateTask(
      board,
      groupId,
      taskId,
      changes
    )
    // Update store immediately for optimistic UI update
    store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
    // Persist to backend
    await updateBoard(updatedBoard)
    return updatedBoard
  } catch (err) {
    console.log('err:', err)
    throw err
  }
}

export async function removeTask(board, groupId, taskId) {
  try {
    const updatedBoard = await taskService.removeTask(board, groupId, taskId)
    store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
    await updateBoard(updatedBoard)
  } catch (err) {
    console.log('Cannot remove task', err)
    throw err
  }
}
