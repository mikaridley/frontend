import { httpService } from '../http.service'

export const groupService = {
    addGroup,
    updateGroup,
    removeGroup,
    reorderGroups,
}

async function addGroup(boardId, groupToAdd) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.post(`board/${id}/group`, groupToAdd)
}

async function updateGroup(boardId, groupId, changes) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    // Handle both group object and groupId string
    const groupIdStr = typeof groupId === 'string' ? groupId : (groupId?.id ? String(groupId.id) : String(groupId))
    return httpService.put(`board/${id}/group/${groupIdStr}`, changes)
}
async function removeGroup(boardId, groupId) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    const groupIdStr = typeof groupId === 'string' ? groupId : (groupId?.id ? String(groupId.id) : String(groupId))
    return httpService.delete(`board/${id}/group/${groupIdStr}`)
}

async function reorderGroups(boardId, fromIdx, toIdx) {
    // Ensure boardId is a string
    const id = typeof boardId === 'string' ? boardId : (boardId?._id ? String(boardId._id) : String(boardId))
    return httpService.put(`board/${id}/group/reorder`, { fromIdx, toIdx })
}
