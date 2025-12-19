import { store } from '../store'
import { taskService } from '../../services/task'
import { UPDATE_BOARD } from '../reducers/board.reducer'

export async function addTask(board, group, task) {
    try {
        await taskService.addTask(board, group, task)
        store.dispatch({ type: UPDATE_BOARD, board })
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}