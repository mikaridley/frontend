import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'

const STORAGE_KEY = 'boardDB'

export const groupService = {
    addGroup,
    updateGroup,
}

async function addGroup(board, groupToAdd) {
    if (!board.groups?.length) board.groups = []

    const group = {
        id: makeId(),
        title: groupToAdd.title
    }
    const newBoard = { ...board, groups: [...board.groups, group] }
    await storageService.put(STORAGE_KEY, newBoard)
    return newBoard
}


async function updateGroup(board, groupToUpdate) {
    if (!board.groups) return
    const idx = board.groups?.findIndex(group => group.id === groupToUpdate.id)
    if (idx === -1) return

    board.groups[idx] = { ...board.groups[idx], ...groupToUpdate }
    await storageService.put(STORAGE_KEY, board)
    return board.groups[idx]
}