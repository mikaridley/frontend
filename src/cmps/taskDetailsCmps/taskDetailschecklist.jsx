export function TaskDetailsChecklist({ board, groupId, taskId, onClose,onOpen }) {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h4>Add checklist</h4> <button className="popup-close" onClick={onClose}>X</button>
                <div className="popup-body">
                    <h6>Title</h6>
                    <form>
                        <input type="text" placeholder="Add checklist..." />
                    </form>
                    <h6>Copy items from…</h6>
                    <select>   {/* TODO: figure copy items from */}
                        <option value="1">Checklist 1</option>
                        <option value="2">Checklist 2</option>
                        <option value="3">Checklist 3</option>
                    </select>
                    <button onClick={() => onOpen('addChecklist')}>

                        Add checklist
                    </button>
                </div>
            </div>
        </div>
    )
}

