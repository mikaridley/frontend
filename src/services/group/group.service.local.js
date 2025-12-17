
export const groupService = {
    addGroup,
    updateGroup,
    removeGroup,
    reorderGroups,
}

function addGroup(board, groupToAdd) {
    board.groups = board.groups || []
    board.groups.push(groupToAdd)
    return board
}

function updateGroup(board, groupId, changes) {
    const idx = board.groups?.findIndex(group => group.id === groupId)
    if (idx > -1) {
        board.groups[idx] = { ...board.groups[idx], ...changes }
    }
    return board
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
