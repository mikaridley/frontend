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

    async function onAddTask() {
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
                        <TaskPreview task={task} />
                    </li>
                )}
            <li>
                {!isAddingTask &&
                    <button onClick={() => setIsAddingTask(true)}>
                        Add a Card
                    </button>
                }
                {isAddingTask &&
                    <section className='add-group flex column'>
                        <input onChange={handleChange} />
                        <button onClick={onAddTask}>Add Card</button>
                        <button type='button' onClick={() => setIsAddingTask(false)}>X</button>
                    </section>
                }
            </li>
        </ul>
    )
}