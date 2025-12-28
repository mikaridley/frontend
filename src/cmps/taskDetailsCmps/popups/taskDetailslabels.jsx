import { taskService } from '../../../services/task'
import { useState, useEffect, useRef } from 'react'
import editIcon from '../../../assets/imgs/icons/edit_label.svg'
import { ColorPicker } from '../ColorPicker'
import { updateTask } from '../../../store/actions/task.actions'
import { loadBoard } from '../../../store/actions/board.actions'
import { popupToViewportHook } from '../../../customHooks/popupToViewportHook'
import { PopUpHeader } from '../../addBoardCmps/PopUpHeader'


export function TaskDetailsLabels({ board, groupId, taskId, onClose, onSave, position }) {
    const [selectedLabelIds, setSelectedLabelIds] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isColorPickerMode, setIsColorPickerMode] = useState(false)
    const [editingLabel, setEditingLabel] = useState(null)
    const popupRef = useRef(null)

    // Check if we're in board-only mode (no task context)
    const isBoardOnlyMode = !groupId || !taskId

    // get available labels from taskService.getLabels
    const availableLabels = taskService.getLabels(board)

    // get current task labels (only if we have task context)
    useEffect(() => {
        if (!isBoardOnlyMode) {
            const task = taskService.getTaskById(board, groupId, taskId)
            if (task?.labels && Array.isArray(task.labels)) {
                const labelIds = task.labels.map(label => label.id || label.color)
                setSelectedLabelIds(labelIds)
            }
        }
    }, [board, groupId, taskId, isBoardOnlyMode])

    async function toggleLabel(labelId) {
        // Only allow toggling if we're in task mode (not board-only mode)
        if (isBoardOnlyMode) return
        
        setSelectedLabelIds(prev => {
            const isSelected = prev.includes(labelId)
            const newSelection = isSelected
                ? prev.filter(id => id !== labelId)
                : [...prev, labelId]
            
            // calculate selected labels from new selection
            const selectedLabels = availableLabels.filter(label => 
                newSelection.includes(label.id || label.color)
            )
            
            // call onSave to update task and TaskDetails labels state
            if (onSave) {
                onSave('labels', selectedLabels)
            }
            
            return newSelection
        })
    }

    function isLabelSelected(label) {
        // In board-only mode, no labels are selected
        if (isBoardOnlyMode) return false
        const labelId = label.id || label.color
        return selectedLabelIds.includes(labelId)
    }

    const filteredLabels = availableLabels.filter(label =>
        label.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        label.color?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // keep popup fully visible vertically.
    popupToViewportHook(popupRef, position, [filteredLabels.length, isColorPickerMode])

    function editLabel(label) {
        setEditingLabel(label)
        setIsColorPickerMode(true)
    }

    function createNewLabel() {
        setEditingLabel(null)
        setIsColorPickerMode(true)
    }

    function closeColorPicker() {
        setIsColorPickerMode(false)
        setEditingLabel(null)
    }

    async function handleLabelSave(updatedLabel) {
        // reload the board to get the updated labels
        if (board?._id) {
            await loadBoard(board._id)
        }
        closeColorPicker()
    }
    
    // Shared content for both inline and regular popup modes
    const popupContent = (
        <>
            {isColorPickerMode ? (
                <>
                    {isBoardOnlyMode && (
                        <PopUpHeader 
                            onBack={closeColorPicker}
                            onClose={onClose}
                            header={editingLabel ? 'Edit label' : 'Create label'}
                        />
                    )}
                    <ColorPicker
                        board={board}
                        groupId={groupId}
                        taskId={taskId}
                        label={editingLabel}
                        onClose={closeColorPicker}
                        onCloseAll={onClose}
                        onSave={handleLabelSave}
                        hideHeader={isBoardOnlyMode}
                    />
                </>
            ) : (
                <>
                    {isBoardOnlyMode ? (
                        <PopUpHeader 
                            onBack={onClose}
                            onClose={onClose}
                            header="Labels"
                        />
                    ) : (
                        <>
                            <button className="popup-close" onClick={onClose}>×</button>
                            <h3>Labels</h3>
                        </>
                    )}
                    <form>
                        <input 
                            type="text" 
                            placeholder="Search labels..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                    <div className="labels-header">
                        <h5>Labels</h5>
                        
                    </div>
                    
                    <div className="popup-body popup-labels-body">
                        {filteredLabels.map((label) => {
                            const labelId = label.id || label.color
                            const isSelected = isLabelSelected(label)
                            return (
                                <div 
                                    key={labelId} 
                                    className={`label-item ${isSelected ? 'selected' : ''}`}
                                    onClick={!isBoardOnlyMode ? () => toggleLabel(labelId) : undefined}
                                >
                                    {!isBoardOnlyMode && (
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected}
                                            onChange={() => toggleLabel(labelId)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                    <div 
                                        className="label-color" 
                                        style={{ backgroundColor: label.color }}
                                    >
                                        <span>{label.title ||''}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            editLabel(label)
                                        }}
                                    >
                                        <img src={editIcon} alt="edit" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    <button className="btn-create-label" onClick={createNewLabel}>Create a new label</button>
                </>
            )}
        </>
    )

    // In board-only mode, render without overlay to fit in board-settings container
    const popupInner = (
        <div 
            ref={popupRef}
            className={`popup-content popup-labels ${isBoardOnlyMode ? 'popup-labels-inline' : ''}`}
            onClick={!isBoardOnlyMode ? (e) => e.stopPropagation() : undefined}
            style={!isBoardOnlyMode && position ? {
                top: `${position.top}px`,
                left: `${position.left}px`
            } : {}}
        >
            {popupContent}
        </div>
    )

    // Conditionally wrap with overlay for non-inline mode
    if (isBoardOnlyMode) {
        return popupInner
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            {popupInner}
        </div>
    )
}

