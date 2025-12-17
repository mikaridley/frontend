
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
    if (!group) return board
    group.tasks = group.tasks || []
    group.tasks.push(taskToAdd)
    return board
}

function updateTask(board, groupId, taskId, changes) {
    const group = board.groups?.find(group => group.id === groupId)
    if (!group || !group.tasks) return board
    const idx = group.tasks.findIndex(task => task.id === taskId)
    if (idx > -1) {
        group.tasks[idx] = { ...group.tasks[idx], ...changes }
    }
    return board
}

function removeTask(board, groupId, taskId) {
    const group = board.groups?.find(group => group.id === groupId)
    if (!group || !group.tasks) return board
    group.tasks = group.tasks.filter(task => task.id !== taskId)
    return board
}


function addComment(board, groupId, taskId, comment) {
    const task = _findTask(board, groupId, taskId)
    if (!task) return board
    task.comments = task.comments || []
    task.comments.push(comment)
    return board
}

function removeComment(board, groupId, taskId, commentId) {
    const task = _findTask(board, groupId, taskId)
    if (!task || !task.comments) return board
    task.comments = task.comments.filter(comment => comment.id !== commentId)
    return board
}

function addChecklist(board, groupId, taskId, checklist) {
    const task = _findTask(board, groupId, taskId)
    if (!task) return board
    task.checklists = task.checklists || []
    task.checklists.push(checklist)
    return board
}

function addTodo(board, groupId, taskId, checklistId, todo) {
    const task = _findTask(board, groupId, taskId)
    if (!task || !task.checklists) return board
    const checklist = task.checklists.find(cl => cl.id === checklistId)
    if (!checklist) return board
    checklist.todos = checklist.todos || []
    checklist.todos.push(todo)
    return board
}

function toggleTodoDone(board, groupId, taskId, checklistId, todoId) {
    const task = _findTask(board, groupId, taskId)
    if (!task || !task.checklists) return board
    const checklist = task.checklists.find(cl => cl.id === checklistId)
    if (!checklist || !checklist.todos) return board
    const todo = checklist.todos.find(td => td.id === todoId)
    if (todo) todo.isDone = !todo.isDone
    return board
}

function _findTask(board, groupId, taskId) {
    const group = board.groups?.find(group => group.id === groupId)
    if (!group || !group.tasks) return null
    return group.tasks.find(task => task.id === taskId) || null
}


