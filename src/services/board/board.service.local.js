
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'

const STORAGE_KEY = 'boards'

export const boardService = {
    query,
    getById,
    save,
    remove,
    addGroup,
}
window.bs = boardService


async function query(filterBy = { txt: ''}) {
    var boards = await storageService.query(STORAGE_KEY)
    const { txt } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        boards = boards.filter(board => {
            // Check board name
            if (regex.test(board.name)) return true
            
            // Check group names
            if (board.groups && Array.isArray(board.groups)) {
                for (const group of board.groups) {
                    if (group.name && regex.test(group.name)) return true
                    
                    // Check task names within groups
                    if (group.tasks && Array.isArray(group.tasks)) {
                        for (const task of group.tasks) {
                            if (task.name && regex.test(task.name)) return true
                            if (task.title && regex.test(task.title)) return true
                        }
                    }
                }
            }
            
            return false
        })
    }
    
    boards = boards.map(({ _id, name }) => ({ _id, name }))
    return boards
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
    await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
    var savedBoard
    if (board._id) {
        const boardToSave = {
            _id: board._id,
            name: board.name
        }
        savedBoard = await storageService.put(STORAGE_KEY, boardToSave)
    } else {
        const boardToSave = {
            _id: makeId(),
            name: board.name
        }
        savedBoard = await storageService.post(STORAGE_KEY, boardToSave)
    }
    return savedBoard
}

async function addGroup(boardId, groupToAdd) {
    // Later, this is all done by the backend
    const board = await getById(boardId)

    const group = {
        _id: makeId(),
        name: groupToAdd.name
    }
    board.groups.push(group)
    await storageService.put(STORAGE_KEY, board)

    return group
}

