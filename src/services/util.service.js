import { boardService } from './board/board.service.local'

export function makeId(length = 6) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

export function makeLorem(size = 100) {
  var words = [
    'The sky',
    'above',
    'the port',
    'was',
    'the color of television',
    'tuned',
    'to',
    'a dead channel',
    '.',
    'All',
    'this happened',
    'more or less',
    '.',
    'I',
    'had',
    'the story',
    'bit by bit',
    'from various people',
    'and',
    'as generally',
    'happens',
    'in such cases',
    'each time',
    'it',
    'was',
    'a different story',
    '.',
    'It',
    'was',
    'a pleasure',
    'to',
    'burn',
  ]
  var txt = ''
  while (size > 0) {
    size--
    txt += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return txt
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

export function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = 1000 * 60 * 60 * 24 * 7

  const pastTime = getRandomIntInclusive(HOUR, WEEK)
  return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export function getValidValues(obj) {
  const newObj = {}
  for (const key in obj) {
    const value = obj[key]
    if (value) {
      newObj[key] = value
    }
  }
  return newObj
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}

export function getMemberInitials(fullname) {
  if (!fullname) return ''
  const parts = fullname.trim().split(' ').filter(Boolean)
  if (!parts.length) return ''
  const first = parts[0][0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] || '' : ''
  return (first + last).toUpperCase()
}

export function getRandomColor() {
  const solidColors = boardService.getBackgrounds().solidColors
  const index = getRandomIntInclusive(0, solidColors.length - 1)
  const gradientColors = boardService.getBackgrounds().gradientColors
  const index2 = getRandomIntInclusive(0, gradientColors.length - 1)
  const result =
    Math.random() < 0.5
      ? { color: solidColors[index], kind: 'solid' }
      : { color: gradientColors[index2], kind: 'gradient' }
  return result
}

// Helper function to check if a file type is an image
export function isImageFile(fileType) {
  return fileType && fileType.startsWith('image/')
}

// Helper function to get file icon based on file type
export function getFileIcon(fileType) {
  if (!fileType) return '📄'

  if (fileType.includes('pdf')) return '📕'
  if (fileType.includes('word') || fileType.includes('document')) return '📘'
  if (fileType.includes('excel') || fileType.includes('spreadsheet'))
    return '📗'
  if (fileType.includes('powerpoint') || fileType.includes('presentation'))
    return '📙'
  if (
    fileType.includes('zip') ||
    fileType.includes('rar') ||
    fileType.includes('7z')
  )
    return '📦'
  if (fileType.includes('text') || fileType.includes('plain')) return '📄'
  if (fileType.includes('json')) return '📋'
  if (fileType.includes('csv')) return '📊'

  return '📄'
}


export function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

export function getColorNameFromHex(colorHex) {
  const colorPalette = [
    { 'color': '#164B35', 'title': 'subtle Green' }, { 'color': '#533F04', 'title': 'subtle yellow' }, { 'color': '#693200', 'title': 'subtle orange' }, { 'color': '#5D1F1A', 'title': 'subtle red' }, { 'color': '#48245D', 'title': 'subtle purple' },
    { 'color': '#216E4E', 'title': 'green' }, { 'color': '#7F5F01', 'title': 'yellow' }, { 'color': '#9E4C00', 'title': 'orange' }, { 'color': '#AE2E24', 'title': 'red' }, { 'color': '#803FA5', 'title': 'purple' },
    { 'color': '#4BCE97', 'title': 'bold green' }, { 'color': '#DDB30E', 'title': 'bold yellow' }, { 'color': '#FCA700', 'title': 'bold orange' }, { 'color': '#F87168', 'title': 'bold red' }, { 'color': '#C97CF4', 'title': 'bold purple' },
    { 'color': '#123263', 'title': 'subtle blue' }, { 'color': '#164555', 'title': 'subtle sky' }, { 'color': '#37471F', 'title': 'subtle lime' }, { 'color': '#50253F', 'title': 'subtle pink' }, { 'color': '#4B4D51', 'title': 'subtle black' },
    { 'color': '#1558BC', 'title': 'blue' }, { 'color': '#206A83', 'title': 'sky' }, { 'color': '#4C6B1F', 'title': 'lime' }, { 'color': '#943D73', 'title': 'pink' }, { 'color': '#63666B', 'title': 'black' },
    { 'color': '#669DF1', 'title': 'bold blue' }, { 'color': '#6CC3E0', 'title': 'bold sky' }, { 'color': '#94C748', 'title': 'bold lime' }, { 'color': '#E774BB', 'title': 'bold pink' }, { 'color': '#96999E', 'title': 'bold black' }
  ]
  
  const normalizedHex = colorHex?.toUpperCase()
  const colorObj = colorPalette.find(c => c.color.toUpperCase() === normalizedHex)
  return colorObj?.title || colorHex
}