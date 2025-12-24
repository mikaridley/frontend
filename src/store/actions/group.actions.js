import { store } from '../store'
import { groupService } from '../../services/group'
import { updateBoard } from './board.actions'
import { UPDATE_BOARD } from '../reducers/board.reducer'

export async function addGroup(board, group) {
    try {
        const updatedBoard = await groupService.addGroup(board, group)
        // Update store immediately for optimistic UI update
        store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
        // Persist to backend
        await updateBoard(updatedBoard)
        return group
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

export async function updateGroup(board, group) {
    try {
        const updatedBoard = await groupService.updateGroup(board, group)
        // Update store immediately for optimistic UI update
        store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
        // Persist to backend
        await updateBoard(updatedBoard)
        return group
    } catch (err) {
        console.log('err:', err)
        throw err
    }
} 