import { useState } from 'react'

import { TaskList } from './TaskList'
import moreIcon from '../assets/img/more.svg'

export function GroupPreview({ group, onUpdateGroup }) {
    const [title, setTitle] = useState(group.title)

    function handleChange({ target }) {
        const value = target.value
        setTitle(value)
    }

    return (
        <section className="group-preview flex column">
            <section className='group-header flex space-between'>
                <input
                    className="title-input"
                    onChange={handleChange}
                    onBlur={() => onUpdateGroup(title, group)}
                    value={title}
                ></input>
                <button>
                    <img src={moreIcon} />
                </button>
            </section>
            <TaskList group={group} />
        </section>
    )
}