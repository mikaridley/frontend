import { TaskPreview } from './TaskPreview'

export function TaskList({ group }) {
    return (
        <ul className='task-list clean-list'>
            {group.tasks?.length &&
                group.tasks.map(task =>
                    <li key={task.id}>
                        <TaskPreview task={task} group={group} />
                    </li>
                )}
        </ul>
    )
}