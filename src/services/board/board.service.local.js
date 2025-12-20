import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'

const STORAGE_KEY = 'boardDB'
const STORAGE_KEY_IMGS = 'imgsDB'
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
_createBoards()

export const boardService = {
  query,
  getById,
  save,
  remove,
  addGroup,
  getEmptyBoard,
  getBackgrounds,
  getBoardBackgrounds,
}
window.bs = boardService

const gBackgrounds = {
  solidColors: [
    '#0079bf',
    '#d29034',
    '#519839',
    '#b04632',
    '#89609e',
    '#cd5a91',
    '#4bbf6b',
    '#00aecc',
    '#838c91',
  ],
  gradiantColors: [
    'linear-gradient(135deg, #1c2c44, #133160)',
    'linear-gradient(135deg, #0e6ae2, #33aec6)',
    'linear-gradient(135deg, #0c65e1, #093676)',
    'linear-gradient(135deg, #0e326d, #bd4f99)',
    'linear-gradient(135deg, #715dc6, #dd72bc)',
    'linear-gradient(135deg, #e34b35, #f89c3c)',
    'linear-gradient(135deg, #e874b9, #f77468)',
    'linear-gradient(135deg, #21865e, #5bc1ca)',
    'linear-gradient(135deg, #4f5e78, #1c2f51)',
    'linear-gradient(135deg, #45290e, #a42a18)',
  ],
}

async function query(filterBy = { txt: '' }) {
  var boards = await storageService.query(STORAGE_KEY)
  const { txt } = filterBy

  // if (txt) {
  //   const regex = new RegExp(filterBy.txt, 'i')
  //   boards = boards.filter(board => {
  //     // Check board name
  //     if (regex.test(board.title)) return true

  //     // Check group names
  //     if (board.groups && Array.isArray(board.groups)) {
  //       for (const group of board.groups) {
  //         if (group.name && regex.test(group.name)) return true

  //         // Check task names within groups
  //         if (group.tasks && Array.isArray(group.tasks)) {
  //           for (const task of group.tasks) {
  //             if (task.name && regex.test(task.name)) return true
  //             if (task.title && regex.test(task.title)) return true
  //           }
  //         }
  //       }
  //     }

  //     return false
  //   })
  // }

  // boards = boards.map(({ _id, name }) => ({ _id, name }))
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
    savedBoard = await storageService.put(STORAGE_KEY, board)
  } else {
    savedBoard = await storageService.post(STORAGE_KEY, board)
  }
  return savedBoard
}

async function addGroup(boardId, groupToAdd) {
  // Later, this is all done by the backend
  const board = await getById(boardId)

  const group = {
    _id: makeId(),
    name: groupToAdd.name,
  }
  board.groups.push(group)
  await storageService.put(STORAGE_KEY, board)

  return group
}

function getEmptyBoard() {
  return {
    isStarred: false,
    archivedAt: null,
    createdBy: {
      _id: '',
      fullname: '',
      imgUrl: '',
    },
    style: {
      background: { color: '', kind: '' },
    },
    labels: [],
    members: [],
    groups: [],
  }
}

async function getRandomBackground(count = 15) {
  console.log('fetching')
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=landscape&orientation=landscape&count=${count}`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_KEY}`,
      },
    }
  )

  const data = await res.json()

  return data.map(photo => ({
    id: photo.id,
    imageUrl: photo.urls.full,
    author: photo.user.name,
    authorLink: photo.user.links.html,
  }))
}

async function getBoardBackgrounds(count = 15) {
  const saved = localStorage.getItem(STORAGE_KEY_IMGS)

  if (saved) return JSON.parse(saved)

  const backgrounds = await getRandomBackground(count)

  localStorage.setItem(STORAGE_KEY_IMGS, JSON.stringify(backgrounds))

  return backgrounds
}

function getBackgrounds() {
  return gBackgrounds
}

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
          background: {
            color: 'linear-gradient(135deg, #0c65e1, #093676)',
            kind: 'gradiant',
          },
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
          background: {
            color: 'linear-gradient(135deg, #0c65e1, #093676)',
            kind: 'gradiant',
          },
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
      },
    ]
  }
  saveToStorage(STORAGE_KEY, boards)
}
