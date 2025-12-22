import { updateTask } from '../../store/actions/task.actions'
import { showErrorMsg } from "../../services/event-bus.service.js"
import doneIcon from '../../assets/img/done.svg'
import emptyCircleIcon from '../../assets/img/empty-circle.svg'

export function TaskDetailsHeader({ task, board, groupId, taskId, onTaskUpdate }) {
    async function onToggleStatus(ev) {
        ev.stopPropagation()

        if (!board) return
        const newStatus = task.status === 'done' ? 'inProgress' : 'done'
        
        try {
            await updateTask(board, groupId, taskId, { status: newStatus })
            onTaskUpdate({ ...task, status: newStatus })
        } catch (err) {
            console.log('Error toggling status:', err)
            showErrorMsg('Cannot update task status')
        }
    }

    if (!task) return null

    return (
        <div className="task-details-header">
            <button className="toggle-done-btn" onClick={onToggleStatus}>
                {task.status === 'done' ?
                    <img title="Mark incomplete" src={doneIcon} style={{ width: '20px', height: '20px' }} alt="Done" />
                    : <img title="Mark complete" src={emptyCircleIcon} style={{ width: '20px', height: '20px' }} alt="Not done" />
                }
            </button>
            <h2>{task.title}</h2>
        </div>
    )
}

