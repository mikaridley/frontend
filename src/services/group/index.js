const { DEV, VITE_LOCAL } = import.meta.env

import { makeId } from '../util.service'
import { groupService as local } from './group.service.local'
import { groupService as remote } from './group.service.remote'

function getEmptyGroup() {
  return {
    id: makeId(),
    title: '',
    tasks: [],
    archivedAt: null,
  }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const groupService = { getEmptyGroup, ...service }

if (DEV) window.groupService = groupService
