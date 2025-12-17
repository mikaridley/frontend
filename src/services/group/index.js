const { DEV, VITE_LOCAL } = import.meta.env

import { groupService as local } from './group.service.local'
import { groupService as remote } from './group.service.remote'

const service = (VITE_LOCAL === 'true') ? local : remote
export const groupService = service

if (DEV) window.groupService = groupService
