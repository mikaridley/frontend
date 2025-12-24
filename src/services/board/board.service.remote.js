import { httpService } from '../http.service'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
const STORAGE_KEY_IMGS = 'imgsDB'

export const boardService = {
  query,
  getById,
  save,
  remove,
  getBackgrounds,
  getBoardBackgrounds,
}

async function query(userId, filterBy = { txt: '' }) {
  var boards = await httpService.get(`board`, filterBy)
  const { txt } = filterBy

  // Filter boards to only show boards where the user is a member (same logic as local service)
  boards = boards.filter(board =>
    board.members.some(member => member._id === userId))
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
//added from local
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
