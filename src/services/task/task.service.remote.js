import { httpService } from '../http.service'

export const taskService = {
    addTask,
    updateTask,
    removeTask,
    moveTask,
    addComment,
    removeComment,
    addChecklist,
    addTodo,
    toggleTodoDone,
}

async function addTask(boardId , groupId, taskToAdd) {
    return httpService.post(`board/${boardId}/group/${groupId}/task`, taskToAdd)
}

async function updateTask(boardId, groupId, taskId, changes) {
    return httpService.put(`board/${boardId}/group/${groupId}/task/${taskId}`, changes)
}

async function removeTask(boardId, groupId, taskId) {
    return httpService.delete(`board/${boardId}/group/${groupId}/task/${taskId}`)
}

async function moveTask(boardId, fromGroupId, toGroupId, fromIdx, toIdx) {
    return httpService.put(`board/${boardId}/group/${fromGroupId}/task/${fromIdx}/move/${toGroupId}/${toIdx}`)
}

async function addComment(boardId, groupId, taskId, comment) {
    return httpService.post(`board/${boardId}/group/${groupId}/task/${taskId}/comment`, comment)
}

async function removeComment(boardId, groupId, taskId, commentId) {
    return httpService.delete(`board/${boardId}/group/${groupId}/task/${taskId}/comment/${commentId}`)
}

async function addChecklist(boardId, groupId, taskId, checklist) {
    return httpService.post(`board/${boardId}/group/${groupId}/task/${taskId}/checklist`, checklist)
}

async function addTodo(boardId, groupId, taskId, checklistId, todo) {
    return httpService.post(`board/${boardId}/group/${groupId}/task/${taskId}/checklist/${checklistId}/todo`, todo)
}

async function toggleTodoDone(boardId, groupId, taskId, checklistId, todoId) {
    return httpService.put(`board/${boardId}/group/${groupId}/task/${taskId}/checklist/${checklistId}/todo/${todoId}/toggle`)
}


