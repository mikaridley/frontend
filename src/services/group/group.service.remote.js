import { httpService } from '../http.service'

export const groupService = {
  addGroup,
  updateGroup,
  removeGroup,
  reorderGroups,
}

async function addGroup(boardId, groupToAdd) {
  console.log('hi')
  return httpService.post(`board/${boardId}/group`, groupToAdd)
}

async function updateGroup(boardId, groupId, changes) {
  return httpService.put(`board/${boardId}/group/${groupId}`, changes)
}
async function removeGroup(boardId, groupId) {
  return httpService.delete(`board/${boardId}/group/${groupId}`)
}

async function reorderGroups(boardId, fromIdx, toIdx) {
  return httpService.put(`board/${boardId}/group/reorder`, { fromIdx, toIdx })
}
