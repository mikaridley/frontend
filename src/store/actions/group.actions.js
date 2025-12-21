import { store } from '../store'
import { groupService } from '../../services/group'
import { SET_BOARD } from '../reducers/board.reducer'

export async function addGroup(board, group) {
    try {
        const newBoard = await groupService.addGroup(board, group)
        store.dispatch({ type: SET_BOARD, board: newBoard })
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

export async function updateGroup(board, group) {
    try {
        await groupService.updateGroup(board, group)
        store.dispatch({ type: SET_BOARD, board })
    } catch {
        console.log('err:', err)
        throw err
    }
} 