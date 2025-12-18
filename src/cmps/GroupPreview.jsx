import { useState } from 'react'

import { TaskList } from './TaskList'

export function GroupPreview({ group, onUpdateGroup }) {
    const [title, setTitle] = useState(group.title)

    function handleChange({ target }) {
        const value = target.value
        setTitle(value)
    }

    return (
        <section className="group-preview flex column">
            <input
                className="title-input"
                onChange={handleChange}
                onBlur={() => onUpdateGroup(title, group)}
                value={title}
            ></input>
            <TaskList group={group} />
        </section>
    )
}