export function TaskDetailsCover({ task, board, groupId, taskId, onTaskUpdate, onOpenPopup }) {
    if (!board || !board.groups || !groupId) return null

    const group = board.groups.find(group => group.id === groupId)
    if (!group) return null

    function handleTransferClick(ev) {
        if (onOpenPopup) {
            onOpenPopup('transferTask', ev)
        }
    }

    return (
        <div className="task-details-cover">
            <button 
                className="group-transfer-btn" 
                onClick={handleTransferClick}
            >
                {group.title}
            </button>
            {task?.title && <img src={task.title} alt="Cover" />}
        </div>
    )
}