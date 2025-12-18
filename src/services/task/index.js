const { DEV, VITE_LOCAL } = import.meta.env

import { taskService as local } from './task.service.local'
import { taskService as remote } from './task.service.remote'

function getEmptyTask() {
    return {
        id: '',
        title: '',
        status: '',
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const taskService = { getEmptyTask, ...service }

if (DEV) window.taskService = taskService