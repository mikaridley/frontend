import { useState } from 'react'
import { useSelector } from 'react-redux'

import { TaskList } from './TaskList'
import { groupService } from '../services/group/'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function GroupPreview({ group }) {
    return (
        <section className="group-preview flex column">
            <input
                className="title-input"
                value={group.title}
            ></input>
            <TaskList tasks={group.tasks} />
        </section>
    )
}