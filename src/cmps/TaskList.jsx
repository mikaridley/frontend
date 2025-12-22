import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskPreview } from "./TaskPreview"

export function TaskList({ group, onToggleStatus, archiveTask }) {
    function TaskSortableItem({ id, children }) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id })

        const style = {
            transform: CSS.Translate.toString(transform),
            transition,
            opacity: isDragging ? 0.3 : 1,
        }

        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
            </div>
        )
    }

    const visibleTasks = group.tasks.filter(task => !task.archivedAt)

    return (
        <div className="task-list flex column">
            {!!group.tasks?.length && visibleTasks.map(task => (
                <TaskSortableItem key={task.id} id={task.id}>
                    <TaskPreview
                        task={task}
                        onToggleStatus={onToggleStatus}
                        archiveTask={archiveTask}
                    />
                </TaskSortableItem>
            ))}
        </div>
    )
}
