import { useState } from 'react'
import { useSelector } from 'react-redux'

import { TaskList } from './TaskList'
import { GroupActions } from './GroupActions'

import { addTask, updateTask } from '../store/actions/task.actions'
import { taskService } from '../services/task'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import moreIcon from '../assets/img/more.svg'
import closeIcon from '../assets/img/close.svg'

export function GroupPreview({ group, onUpdateGroup, archiveGroup }) {
    const board = useSelector(storeState => storeState.boardModule.board)

    const [title, setTitle] = useState(group.title)
    const [isActionsOpen, setIsActionsOpen] = useState()

    const [task, setTask] = useState(taskService.getEmptyTask())
    const [isAddingTask, setIsAddingTask] = useState(false)

    async function onAddTask() {
        setIsAddingTask(false)

        try {
            if (!task.title) return
            await addTask(board, group, task)
            showSuccessMsg('Added')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to Add`)
        }
        setTask('')
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        await onAddTask()
        if (!task.title) return
        setIsAddingTask(true)
    }

    async function archiveTask(task) {
        try {
            const archivedAt = Date.now()
            await updateTask(board, group.id, task.id, { archivedAt })
            showSuccessMsg('Task archived')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to archive`)
        }
        setTask('')
    }

    function onArchiveGroup() {
        onToggleActions()
        archiveGroup(group)
    }

    async function onToggleStatus(ev, task) {
        ev.stopPropagation()

        if (task.status === 'done') {
            task.status = 'inProgress'
        } else {
            task.status = 'done'
        }
        await updateTask(board, group.id, task.id, { status: task.status })
        setTask(prevTask => ({ ...prevTask, ...task }))
    }

    function onToggleActions() {
        setIsActionsOpen(isActionsOpen => !isActionsOpen)
    }

    function handleGroupChange({ target }) {
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
                    onChange={handleGroupChange}
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
            <TaskList
                group={group}
                onToggleStatus={onToggleStatus}
                archiveTask={archiveTask}
            />
            {!isAddingTask ?
                <button className='add-btn' onClick={() => setIsAddingTask(true)}>
                    Add a Card
                </button>

                : <form className='add-form' onSubmit={handleSubmit}>
                    <input
                        onChange={handleTaskChange}
                        onBlur={onAddTask}
                        placeholder='Enter a title'
                        autoFocus
                    />

                    <div className='form-btns flex'>
                        <button className='btn' onMouseDown={handleSubmit}>
                            Add Card
                        </button>
                        <button type='button' onClick={() => setIsAddingTask(false)}>
                            <img src={closeIcon} />
                        </button>
                    </div>
                </form>
            }
        </section>
    )
}