import { store } from '../store'
import { groupService } from '../../services/group'
import { getCmdUpdateBoard, updateBoard } from './board.actions'
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

export async function updateGroup(board, group, isArchive) {
  const prevGroup = { ...group, archivedAt: null }
  const prevBoard = {
    ...board,
    groups: board.groups.map(group =>
      group.id === prevGroup.id ? prevGroup : group
    ),
  }

  // const prevBoard = board
  try {
    const updatedBoard = await groupService.updateGroup(board, group)
    // Persist to backend
    await updateBoard(updatedBoard, prevBoard, isArchive)
    return group
  } catch (err) {
    console.log('err:', err)
    throw err
  }
}

export async function removeGroup(board, groupId) {
  try {
    const updatedBoard = await groupService.removeGroup(board, groupId)
    store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
    await updateBoard(updatedBoard)
  } catch (err) {
    console.log('Cannot remove task', err)
    throw err
  }
}
