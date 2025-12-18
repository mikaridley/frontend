
import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'

const STORAGE_KEY = 'boardDB'
_createBoards()

export const boardService = {
    query,
    getById,
    save,
    remove,
}
window.bs = boardService


async function query(filterBy = { txt: '' }) {
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
            title: board.title
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

// async function addGroup(boardId, groupToAdd) {
//     // Later, this is all done by the backend
//     const board = await getById(boardId)

//     const group = {
//         _id: makeId(),
//         name: groupToAdd.name
//     }
//     board.groups.push(group)
//     await storageService.put(STORAGE_KEY, board)

//     return group
// }

function _createBoards() {
    let boards = loadFromStorage(STORAGE_KEY)
    if (!boards || !boards.length) {
        boards = [
            {
                _id: makeId(),
                title: 'Board1',
                isStarred: false,
                archivedAt: null,
                createdBy: {
                    _id: 'u101',
                    fullname: 'Abi Abambi',
                    imgUrl: 'http://some-img',
                },
                style: {
                    backgroundImage: '',
                },
                labels: [
                    {
                        id: 'l101',
                        title: '',
                        color: '#61BD4F',
                    },
                    {
                        id: 'l102',
                        title: '',
                        color: '#2531b4ff',
                    },
                ],
                members: [
                    {
                        _id: 'u101',
                        fullname: 'Tal Taltal',
                        imgUrl: 'https://www.google.com',
                    },
                    {
                        _id: 'u102',
                        fullname: 'Josh Ga',
                        imgUrl: 'https://www.google.com',
                    },
                ],
                groups: [
                    {
                        id: 'g101',
                        title: 'Group1',
                        archivedAt: null,
                        tasks: [
                            {
                                id: 'c101',
                                title: 'Replace logo',
                            },
                            {
                                id: 'c102',
                                title: 'Add Samples',
                            },
                        ],
                    },
                    {
                        id: 'g102',
                        title: 'Group 2',
                        tasks: [
                            {
                                id: 'c103',
                                title: 'Do that',
                            },
                            {
                                id: 'c104',
                                title: 'Help me',
                                style: {
                                    backgroundColor: '#26DE81',
                                },
                            },
                        ],
                    },
                ],
                // activities: [
                //     {
                //         id: 'a101',
                //         title: 'Changed Color',
                //         createdAt: 154514,
                //         byMember: {
                //             _id: 'u101',
                //             fullname: 'Abi Abambi',
                //             imgUrl: 'http://some-img',
                //         },
                //         group: {
                //             id: 'g101',
                //             title: 'Urgent Stuff',
                //         },
                //         task: {
                //             id: 'c101',
                //             title: 'Replace Logo',
                //         },
                //     },
                // ]
            },
            {
                _id: makeId(),
                title: 'Board2',
                isStarred: false,
                archivedAt: null,
                createdBy: {
                    _id: 'u102',
                    fullname: 'Muki Mu',
                    imgUrl: 'http://some-img',
                },
                style: {
                    backgroundImage: '',
                },
                labels: [
                    {
                        id: 'l101',
                        title: '',
                        color: '#61BD4F',
                    },
                    {
                        id: 'l102',
                        title: '',
                        color: '#2531b4ff',
                    },
                ],
                members: [
                    {
                        _id: 'u101',
                        fullname: 'Tal Taltal',
                        imgUrl: 'https://www.google.com',
                    },
                    {
                        _id: 'u102',
                        fullname: 'Josh Ga',
                        imgUrl: 'https://www.google.com',
                    },
                ],
                groups: [
                    {
                        id: 'g101',
                        title: 'Group1',
                        archivedAt: null,
                        tasks: [
                            {
                                id: 'c101',
                                title: 'Replace logo',
                            },
                            {
                                id: 'c102',
                                title: 'Add Samples',
                            },
                        ],
                    },
                    {
                        id: 'g102',
                        title: 'Group 2',
                        tasks: [
                            {
                                id: 'c103',
                                title: 'Do that',
                            },
                            {
                                id: 'c104',
                                title: 'Help me',
                                style: {
                                    backgroundColor: '#26DE81',
                                },
                            },
                        ],
                    },
                ],
            }
        ]
    }
    saveToStorage(STORAGE_KEY, boards)
}
