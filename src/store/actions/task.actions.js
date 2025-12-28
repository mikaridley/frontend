import { store } from '../store'
import { taskService } from '../../services/task'
import { updateBoard } from './board.actions'
import { UPDATE_BOARD } from '../reducers/board.reducer'
import { logActivity, ACTIVITY_TYPES } from '../../services/activity.service'
import { logTaskActivities } from '../../services/task/taskActivityLogger'

export async function addTask(board, group, task) {
  try {
    const updatedBoard = await taskService.addTask(board, group, task)
    const taskObj = updatedBoard.groups.find(g => g.id === group.id)?.tasks?.find(t => t.id === task.id)
    logActivity(updatedBoard, ACTIVITY_TYPES.TASK_CREATED, { 
      taskTitle: task.title || taskObj?.title,
      taskId: task.id || taskObj?.id,
      groupTitle: group.title,
      groupId: group.id
    })
    // update store immediately for optimistic UI update
    store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
    // persist to backend
    await updateBoard(updatedBoard)
    return updatedBoard
  } catch (err) {
    console.log('err:', err)
    throw err
  }
}

export async function updateTask(board, groupId, taskId, changes) {
  try {
    const oldTask = taskService.getTaskById(board, groupId, taskId)
    const updatedBoard = await taskService.updateTask(
      board,
      groupId,
      taskId,
      changes
    )
    
    // log activities for task changes
    logTaskActivities(updatedBoard, oldTask, changes, groupId, taskId)
    
    // update store immediately for optimistic UI update
    store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
    // persist to backend
    await updateBoard(updatedBoard)
    return updatedBoard
  } catch (err) {
    console.log('err:', err)
    throw err
  }
}

export async function removeTask(board, groupId, taskId) {
  try {
    const task = taskService.getTaskById(board, groupId, taskId)
    const group = board.groups.find(g => g.id === groupId)
    const updatedBoard = await taskService.removeTask(board, groupId, taskId)
    
    // log activity for task deletion
    logActivity(updatedBoard, ACTIVITY_TYPES.TASK_DELETED, {
      taskId,
      taskTitle: task?.title,
      groupTitle: group?.title,
    })
    
    // update store immediately for optimistic UI update
    store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
    // persist to backend
    await updateBoard(updatedBoard)
  } catch (err) {
    console.log('Cannot remove task', err)
    throw err
  }
}
