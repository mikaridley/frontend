import { TaskPreview } from './TaskPreview'
import { SortableItem } from './SortableItem'

export function TaskList({ group, onToggleStatus, archiveTask }) {

  const visibleTasks = group.tasks.filter(task => !task.archivedAt)

  return (
    <div className="task-list flex column">
      {visibleTasks.map(task => (
        <SortableItem key={task.id} id={task.id}>
          <TaskPreview
            task={task}
            group={group}
            onToggleStatus={onToggleStatus}
            archiveTask={archiveTask}
          />
        </SortableItem>
      ))}
    </div>
  )
}
