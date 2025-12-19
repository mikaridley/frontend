export function TaskDetailsMembers({ board, groupId, taskId, onClose, onSave, position }) {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div 
                className="popup-content popup-members" 
                onClick={(e) => e.stopPropagation()}
                style={position ? {
                    top: `${position.top}px`,
                    left: `${position.left}px`
                } : {}}
            >
                <button className="popup-close" onClick={onClose}>×</button>
                <h3>Members</h3>
                <div className="popup-body">
                    {/* TODO: Add members content when we have users */}
                </div>
            </div>
        </div>
    )
}

