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

function getDefaultFilter() {
    return {
        txt: '',
    }
}

function getSearchParams(searchParams) {
    return {
        txt: searchParams.get('txt') || '',
        members: searchParams.getAll('members') || [],
        status: searchParams.get('status') || '',
        dueDate: searchParams.getAll('dueDate') || [],
        labels: searchParams.getAll('labels') || [],
        activity: searchParams.getAll('activity') || [],
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const boardService = { getEmptyBoard, getDefaultFilter, getSearchParams, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
