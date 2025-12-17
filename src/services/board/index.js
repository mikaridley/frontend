const { DEV, VITE_LOCAL } = import.meta.env

import { makeId } from '../util.service'

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

function getEmptyBoard() {
	return {
        _id: '',
		name: makeId(),
		groups: [],
	}
}

function getDefaultFilter() {
    return {
        txt: '',
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const boardService = { getEmptyBoard, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
