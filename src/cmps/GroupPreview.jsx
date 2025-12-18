import { useState } from 'react'
import { useSelector } from 'react-redux'

import { TaskList } from './TaskList'
import { GroupActions } from './GroupActions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

import moreIcon from '../assets/img/more.svg'

export function GroupPreview({ group, onUpdateGroup, archiveGroup }) {
    const board = useSelector(storeState => storeState.boardModule.board)

    const [title, setTitle] = useState(group.title)
    const [isActionsOpen, setIsActionsOpen] = useState()

    const [task, setTask] = useState(taskService.getEmptyTask())
    const [isAddingTask, setIsAddingTask] = useState(false)

    async function onAddTask(ev) {
        ev.preventDefault()
        setIsAddingTask(false)

        try {
            if (!task.title) return
            await taskService.addTask(board, group, task)
            setIsAddingTask(true)
            showSuccessMsg('Added')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to Add`)
        }
        setTask(task => task.title = '')
    }

    function onToggleActions() {
        setIsActionsOpen(isActionsOpen => !isActionsOpen)
    }

    function onArchiveGroup() {
        onToggleActions()
        archiveGroup(group)
    }

    function handleTitleChange({ target }) {
        const value = target.value
        setTitle(value)
    }

    function handleTaskChange({ target }) {
        const value = target.value
        setTask(prevTask => ({ ...prevTask, title: value }))
    }

    return (
        <section className="group-preview flex column">
            <header className='group-header flex space-between'>
                <input
                    className="title-input"
                    onChange={handleTitleChange}
                    onBlur={() => onUpdateGroup(title, group)}
                    value={title}
                ></input>
                <button onClick={onToggleActions}>
                    <img src={moreIcon} />
                </button>
                {isActionsOpen &&
                    <GroupActions
                        onToggleActions={onToggleActions}
                        onArchiveGroup={onArchiveGroup}
                        setIsAddingTask={setIsAddingTask}
                    />
                }
            </header>
            <TaskList group={group} />
            {!isAddingTask ?
                <button className='add-btn' onClick={() => setIsAddingTask(true)}>
                    Add a Card
                </button>

                : <form className='add-form'>
                    <input
                        onChange={handleTaskChange}
                        onBlur={onAddTask}
                        autoFocus
                    />

                    <div className='form-btns'>
                        <button className='btn' onClick={onAddTask}>
                            Add Card
                        </button>
                        <button type='button' onClick={() => setIsAddingTask(false)}>X</button>
                    </div>
                </form>
            }
        </section>
    )
}