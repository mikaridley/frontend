import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'

const STORAGE_KEY = 'boardDB'

export const groupService = {
    addGroup,
    updateGroup,
    removeGroup,
    reorderGroups,
    getGroupById,
}

async function addGroup(board, groupToAdd) {
    if (!board.groups?.length) board.groups = []
    const group = {
        id: makeId(),
        title: groupToAdd.title
    }
    board.groups.push(group)
    await storageService.put(STORAGE_KEY, board)
    return group
}


async function updateGroup(board, groupId, changes) {
    const idx = board.groups?.findIndex(group => group.id === groupId)
    if (idx === -1) return
    board.groups[idx] = { ...board.groups[idx], ...changes }
    return await storageService.put(STORAGE_KEY, board)
}

function removeGroup(board, groupId) {
    board.groups = (board.groups || []).filter(group => group.id !== groupId)
    return board
}

function reorderGroups(board, fromIdx, toIdx) {
    if (!board.groups || fromIdx === toIdx) return board
    const groups = [...board.groups]
    const [moved] = groups.splice(fromIdx, 1)
    groups.splice(toIdx, 0, moved)
    board.groups = groups
    return board
}

function getGroupById(board, groupId) {
    return board.groups?.find(group => group.id === groupId) || null
}