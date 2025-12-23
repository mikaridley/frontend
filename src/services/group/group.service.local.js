import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'

const STORAGE_KEY = 'boardDB'

export const groupService = {
    addGroup,
    updateGroup,
}

async function addGroup(board, group) {
    if (!board.groups?.length) board.groups = []

    const newGroup = {
        id: group.id,
        title: group.title,
        archivedAt: '',
        tasks: []
    }
    const newBoard = { ...board, groups: [...board.groups, group] }
    await storageService.put(STORAGE_KEY, newBoard)
    return { newBoard, newGroup }
}


async function updateGroup(board, groupToUpdate) {
    if (!board.groups) return
    const idx = board.groups?.findIndex(group => group.id === groupToUpdate.id)
    if (idx === -1) return

    board.groups[idx] = { ...board.groups[idx], ...groupToUpdate }
    await storageService.put(STORAGE_KEY, board)
    return board.groups[idx]
}