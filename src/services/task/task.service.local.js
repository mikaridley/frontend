import { storageService } from "../async-storage.service"
import { makeId } from "../util.service"
const STORAGE_KEY = 'boardDB'

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
    getTaskById,
    getLabels,
}

async function addTask(board, group, taskToAdd) {
    if (!group.tasks?.length) group.tasks = []
    const task = {
        id: makeId(),
        title: taskToAdd.title,
    }
    group.tasks.push(task)
    await storageService.put(STORAGE_KEY, board)
    return board
}

function updateTask(board, groupId, taskId, changes) {
    const group = board.groups?.find(group => group.id === groupId)

    if (!group || !group.tasks) return board
    const idx = group.tasks.findIndex(task => task.id === taskId)
    if (idx === -1) return
    group.tasks[idx] = { ...group.tasks[idx], ...changes }

    return board
}

function removeTask(board, groupId, taskId) {
    const group = board.groups?.find(group => group.id === groupId)
    if (!group || !group.tasks) return board
    group.tasks = group.tasks.filter(task => task.id !== taskId)
    return board
}

function moveTask(board, fromGroupId, toGroupId, fromIdx, toIdx) {
    const fromGroup = board.groups?.find(group => group.id === fromGroupId)
    const toGroup = board.groups?.find(group => group.id === toGroupId)
    if (!fromGroup || !toGroup || !fromGroup.tasks) return board
    const tasksFrom = [...fromGroup.tasks]
    const [moved] = tasksFrom.splice(fromIdx, 1)
    fromGroup.tasks = tasksFrom
    toGroup.tasks = toGroup.tasks || []
    toGroup.tasks.splice(toIdx, 0, moved)
    return board
}

function addComment(board, groupId, taskId, comment) {
    const task = getTaskById(board, groupId, taskId)
    if (!task) return board
    task.comments = task.comments || []
    task.comments.push(comment)
    return board
}

function removeComment(board, groupId, taskId, commentId) {
    const task = getTaskById(board, groupId, taskId)
    if (!task || !task.comments) return board
    task.comments = task.comments.filter(comment => comment.id !== commentId)
    return board
}

function addChecklist(board, groupId, taskId, checklist) {
    const task = getTaskById(board, groupId, taskId)
    if (!task) return board
    task.checklists = task.checklists || []
    task.checklists.push(checklist)
    return board
}

function addTodo(board, groupId, taskId, checklistId, todo) {
    const task = getTaskById(board, groupId, taskId)
    if (!task || !task.checklists) return board
    const checklist = task.checklists.find(cl => cl.id === checklistId)
    if (!checklist) return board
    checklist.todos = checklist.todos || []
    checklist.todos.push(todo)
    return board
}

function toggleTodoDone(board, groupId, taskId, checklistId, todoId) {
    const task = getTaskById(board, groupId, taskId)
    if (!task || !task.checklists) return board
    const checklist = task.checklists.find(cl => cl.id === checklistId)
    if (!checklist || !checklist.todos) return board
    const todo = checklist.todos.find(td => td.id === todoId)
    if (todo) todo.isDone = !todo.isDone
    return board
}

function getTaskById(board, groupId, taskId) {
    const group = board.groups?.find(group => group.id === groupId)
    if (!group || !group.tasks) return null
    return group.tasks.find(task => task.id === taskId) || null
}

function getLabels(board, groupId, taskId) {
    const task = getTaskById(board, groupId, taskId)
    if (!task || !task.labels) {
        const labels = [{ color: '#eb3434', title: '' }, { color: '#f5ed05ff', title: '' }, { color: '#56ed15', title: '' }, { color: '#1548ed', title: '' }, { color: '#ed15e6', title: '' }, { color: '#ed8815', title: '' }]
        return labels
    }
    return task.labels
}