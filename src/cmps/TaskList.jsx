import { useState } from 'react'
import { taskService } from '../services/task/'
import { TaskPreview } from './TaskPreview'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function TaskList({ group }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const { tasks } = group
    const [newTask, setNewTask] = useState(taskService.getEmptyTask())
    const [isAddingTask, setIsAddingTask] = useState(false)

    async function onAddTask(ev) {
        ev.preventDefault()
        setIsAddingTask(false)

        try {
            if (!newTask.title) return

            await taskService.addTask(board, group, newTask)
            setIsAddingTask(true)
            showSuccessMsg('Added')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg(`Failed to Add`)
        }
    }

    function handleChange({ target }) {
        const value = target.value
        setNewTask(prevTask => ({ ...prevTask, title: value }))
    }

    return (
        <ul className='task-list clean-list'>
            {tasks?.length &&
                tasks.map(task =>
                    <li key={task.id}>
                        <TaskPreview task={task} group={group} />
                    </li>
                )}
            <li>
                {!isAddingTask &&
                    <button className='add-btn' onClick={() => setIsAddingTask(true)}>
                        Add a Card
                    </button>
                }
                {isAddingTask &&
                    <form className='add-form'>
                        <textarea onChange={handleChange} autoFocus 
                        // onBlur={() => setIsAddingTask(false)}
                         />

                        <div className='form-btns'>
                            <button className='btn' onClick={onAddTask}>Add Card</button>
                            <button type='button' onClick={() => setIsAddingTask(false)}>X</button>
                        </div>
                    </form>
                }
            </li>
        </ul>
    )
}