
export const taskService = {
    addTask,
    updateTask,
    removeTask,
    addComment,
    removeComment,
    addChecklist,
    addTodo,
    toggleTodoDone,
}

function addTask(board, groupId, taskToAdd) {
    const group = board.groups?.find(group => group.id === groupId)
    
    return board
}

function updateTask(board, groupId, taskId, changes) {
    const group = board.groups?.find(group => group.id === groupId)

    return board
}

function removeTask(board, groupId, taskId) {
    const group = board.groups?.find(group => group.id === groupId)

    return board
}


function addComment(board, groupId, taskId, comment) {
    const task = _findTask(board, groupId, taskId)

    return board
}

function removeComment(board, groupId, taskId, commentId) {
    const task = _findTask(board, groupId, taskId)

    return board
}

function addChecklist(board, groupId, taskId, checklist) {
    const task = _findTask(board, groupId, taskId)

    return board
}

function addTodo(board, groupId, taskId, checklistId, todo) {
    const task = _findTask(board, groupId, taskId)

    return board
}

function toggleTodoDone(board, groupId, taskId, checklistId, todoId) {
    const task = _findTask(board, groupId, taskId)

}

function _findTask(board, groupId, taskId) {
    const group = board.groups?.find(group => group.id === groupId)
    if (!group || !group.tasks) return null
    return group.tasks.find(task => task.id === taskId) || null
}


