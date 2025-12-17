const { DEV, VITE_LOCAL } = import.meta.env

import { taskService as local } from './task.service.local'
import { taskService as remote } from './task.service.remote'

const service = (VITE_LOCAL === 'true') ? local : remote
export const taskService = service

if (DEV) window.taskService = taskService