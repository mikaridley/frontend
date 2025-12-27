import io from 'socket.io-client'
import { userService } from './user'
const { VITE_LOCAL, DEV } = import.meta.env

export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EVENT_BOARD_REMOVED = 'board-removed'
export const SOCKET_EVENT_BOARD_ADDED = 'board-added'
export const SOCKET_EVENT_BOARD_UPDATED = 'board-updated'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'

export const socketService =
  VITE_LOCAL === 'true' ? createDummySocketService() : createSocketService()

// for debugging from console
if (DEV) window.socketService = socketService

socketService.setup()

function createSocketService() {
  var socket = null
  const socketService = {
    setup() {
      socket = io(baseUrl)
      const user = userService.getLoggedinUser()
      if (user) this.login(user._id)
    },
    on(eventName, cb) {
      socket.on(eventName, cb)
    },
    off(eventName, cb = null) {
      if (!socket) return
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName, data) {
      socket.emit(eventName, data)
    },
    login(userId) {
      socket.emit(SOCKET_EMIT_LOGIN, userId)
    },
    logout() {
      socket.emit(SOCKET_EMIT_LOGOUT)
    },
    terminate() {
      socket = null
    },
  }
  return socketService
}

function createDummySocketService() {
  var listenersMap = {}
  const socketService = {
    listenersMap,
    setup() {
      listenersMap = {}
    },
    terminate() {
      this.setup()
    },
    login() {
      console.log('Dummy socket service here, login - got it')
    },
    logout() {
      console.log('Dummy socket service here, logout - got it')
    },
    on(eventName, cb) {
      listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
    },
    off(eventName, cb) {
      if (!listenersMap[eventName]) return
      if (!cb) delete listenersMap[eventName]
      else
        listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
    },
  }
  window.listenersMap = listenersMap
  return socketService
}
