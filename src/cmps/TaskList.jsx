import { TaskPreview } from './TaskPreview'

export function TaskList({ tasks }) {
    console.log('tasks:', tasks)

    return (
        <section className="task-list">
            <ul className='clean-list'>
                {tasks.map(task =>
                    <li key={task.id}>
                        <TaskPreview task={task} />
                    </li>
                )}
            </ul>
            <button>Add a card</button>
        </section>
    )
}