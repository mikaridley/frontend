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

// async function query(filterBy = { txt: '' }) {
//   return httpService.get(`board`, filterBy)
// }

// async function query(userId) {
//   var boards = await httpService.get(`board`)

//   boards = boards.filter(board =>
//     board.members.some(member => member._id === userId)
//   )
//   return boards
// }

async function query(userId) {
  const filterBy = userId ? { members: userId } : {}
  const boards = await httpService.get('board', filterBy)
  return boards
}

async function queryFiltered(filterBy = { title: '' }) {
  var boards = await httpService.get(`board`, filterBy)

  // const { title } = filterBy
  // if (!title) return ''

  // if (title) {
  //   const regex = new RegExp(title, 'i')
  //   boards = boards.filter(board => {
  //     return regex.test(board.title)
  //   })
  // }

  return boards
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
    members: [
      {
        _id: 'u101',
        email: 'admin@gmail.com',
        fullname: 'Admin',
        imgUrl:
          'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
      },
    ],
    groups: [],
    activities: [],
  }
}
