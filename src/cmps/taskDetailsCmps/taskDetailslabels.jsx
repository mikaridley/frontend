import {taskService} from '../../services/task/task.service.local'

export function TaskDetailsLabels({ board, groupId, taskId, onClose, onOpen }) {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>×</button>
                <h3>Labels</h3>
                <form>
                    <input type="text" placeholder="Search labels..." />
                </form>
                <h5>Labels</h5>
                
                <div className="popup-body">
                    
                </div>
            </div>
        </div>
    )
}

