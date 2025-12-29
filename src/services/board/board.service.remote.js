import { httpService } from '../http.service'

const STORAGE_KEY_IMGS = 'imgsDB'
export const boardService = {
  query,
  getById,
  save,
  remove,
  queryFiltered,
  getBackgrounds,
  getBoardBackgrounds,
  getEmptyBoard,
  aiCommand,
  getFilteredBoard,
}

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY

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
  gradientColors: [
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

async function query(userId) {
  const filterBy = userId ? { members: userId } : {}
  const boards = await httpService.get('board', filterBy)
  return boards
}

async function queryFiltered(filterBy = { title: '' }) {
  return await httpService.get(`board`, filterBy)
}

function getById(boardId) {
  return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
  return httpService.delete(`board/${boardId}`)
}

async function save(board) {
  var savedBoard
  if (board._id) {
    savedBoard = await httpService.put(`board/${board._id}`, board)
  } else {
    savedBoard = await httpService.post('board', board)
  }
  return savedBoard
}

function getBackgrounds() {
  return gBackgrounds
}

async function getBoardBackgrounds(count = 15) {
  const saved = localStorage.getItem(STORAGE_KEY_IMGS)
  if (saved) return JSON.parse(saved)

  const backgrounds = await getRandomBackground(count)

  localStorage.setItem(STORAGE_KEY_IMGS, JSON.stringify(backgrounds))

  return backgrounds
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
    imageUrl: photo.urls.thumb, //regular/thumb/small_s3
    imageUrlFull: photo.urls.full,
    author: photo.user.name,
    authorLink: photo.user.links.html,
  }))
}

function getFilteredBoard(board, filterBy) {
  if (!filterBy) return board

  const groups = board.groups.map(group => {
    let { tasks } = group

    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i')
      tasks = tasks.filter(task => regExp.test(task.title))
    }

    if (filterBy.members.length) {
      tasks = tasks.filter(task =>
        filterBy.members.some(member => {
          if (member === 'none') return !task.members || !task.members.length
          return task.members?.some(taskMember => taskMember._id === member)
        })
      )
    }

    if (filterBy.status) {
      if (filterBy.status === 'done') {
        tasks = tasks.filter(task => task.status === 'done')
      } else {
        tasks = tasks.filter(
          task => task.status === 'inProgress' || !task.status
        )
      }
    }

    if (filterBy.dueDate.length) {
      if (filterBy.dueDate.includes('none')) {
        tasks = tasks.filter(task => !task.dates)
      } else {
        tasks = tasks.filter(task => {
          const now = Date.now()
          const target = new Date(task.dates?.dateTime)
          const diffMs = target - now
          const diffHours = diffMs / (1000 * 60 * 60)

          if (filterBy.dueDate.includes('overdue')) {
            return diffHours <= 0 && task.status !== 'done'
          } else {
            return diffHours <= 24 && diffHours >= 0 && task.status !== 'done'
          }
        })
      }
    }

    if (filterBy.labels.length) {
      tasks = tasks.filter(task =>
        filterBy.labels.some(label => {
          if (label === 'none') return !task.labels || !task.labels.length
          return task.labels?.some(taskLabel => taskLabel.id === label)
        })
      )
    }
    return { ...group, tasks }
  })
  return { ...board, groups }
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
      labels: [
      { color: '#AE2E24', title: '', colorName: 'red' },
      { color: '#DDB30E', title: '', colorName: 'bold yellow' },
      { color: '#216E4E', title: '', colorName: 'green' },
      { color: '#1558BC', title: '', colorName: 'blue' },
      { color: '#C97CF4', title: '', colorName: 'bold purple' },
      { color: '#7F5F01', title: '', colorName: 'yellow' }
    ],
    members: [],
    groups: [],
    activities: [],
  }
}

async function aiCommand(prompt) {
  return httpService.post('board/command', { prompt })
}
