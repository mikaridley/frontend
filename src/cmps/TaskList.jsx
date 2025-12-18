import { useState } from 'react'
import { taskService } from '../services/task/'
import { TaskPreview } from './TaskPreview'
import { useSelector } from 'react-redux'

export function TaskList({ group }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const { tasks } = group
    const [newTask, setNewTask] = useState(taskService.getEmptyTask())
    const [isAddingTask, setIsAddingTask] = useState(false)

    function onAddTask() {
        setIsAddingTask(false)
        if (!newTask.title) return
        taskService.addTask(board, group, newTask)
    }

    function handleChange({ target }) {
        const value = target.value
        setNewTask(prevTask => ({ ...prevTask, title: value }))
    }

    return (
        <ul className='task-list clean-list'>
            {tasks?.length && tasks.map(task =>
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