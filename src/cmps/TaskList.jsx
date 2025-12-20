import { TaskPreview } from './TaskPreview'

export function TaskList({ group, onToggleStatus, archiveTask }) {
    return (
        <ul className='task-list clean-list'>
            {group.tasks?.length &&
                group.tasks.map(task =>
                    !task.archivedAt &&
                    <li key={task.id}>
                        <TaskPreview
                            task={task}
                            group={group}
                            onToggleStatus={onToggleStatus}
                            archiveTask={archiveTask}
                        />
                    </li>
                )}
        </ul>
    )
}