export const groupService = {
    addGroup,
    updateGroup,
    removeGroup,
    reorderGroups,
}

async function addGroup(board, groupToAdd) {
    if (!board.groups?.length) board.groups = []
    
    const updatedBoard = {
        ...board,
        groups: [...board.groups, groupToAdd]
    }
    return updatedBoard
}

async function updateGroup(board, groupToUpdate) {
    if (!board.groups || !groupToUpdate?.id) return board
    
    const idx = board.groups.findIndex(group => group.id === groupToUpdate.id)
    if (idx === -1) return board
    
    const updatedBoard = {
        ...board,
        groups: board.groups.map((group, i) => 
            i === idx ? { ...group, ...groupToUpdate } : group
        )
    }
    return updatedBoard
}

async function removeGroup(board, groupId) {
    if (!board.groups) return board
    
    // Handle both string and object
    const id = typeof groupId === 'string' ? groupId : (groupId?.id ? groupId.id : groupId)
    
    const updatedBoard = {
        ...board,
        groups: board.groups.filter(group => group.id !== id)
    }
    return updatedBoard
}

async function reorderGroups(board, fromIdx, toIdx) {
    if (!board.groups || fromIdx === toIdx) return board
    
    const groups = [...board.groups]
    const [movedGroup] = groups.splice(fromIdx, 1)
    groups.splice(toIdx, 0, movedGroup)
    
    const updatedBoard = {
        ...board,
        groups
    }
    return updatedBoard
}
