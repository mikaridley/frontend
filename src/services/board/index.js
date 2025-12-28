const { DEV, VITE_LOCAL } = import.meta.env

import { Activity } from 'react'
import { makeId } from '../util.service'

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

function getEmptyBoard() {
    return {
        _id: '',
        name: makeId(),
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
        activities: [],
    }
}

function getDefaultFilter() {
    return {
        txt: '',
    }
}

function getSearchParams(searchParams) {
    return {
        txt: searchParams.get('txt') || '',
        members: searchParams.get('members') || [],
        status: searchParams.get('status') || [],
        dueDate: searchParams.get('dueDate') || [],
        labels: searchParams.get('labels') || [],
        Activity: searchParams.get('Activity') || [],
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const boardService = { getEmptyBoard, getDefaultFilter, getSearchParams, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
