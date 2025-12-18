import { taskService } from '../../services/task/task.service.local'
import { boardService } from '../../services/board'
import { useState, useEffect } from 'react'
import editIcon from '../../assets/imgs/icons/edit_label.svg'
import { ColorPicker } from './ColorPicker'

export function TaskDetailsLabels({ board, groupId, taskId, onClose, onSave }) {
    const [selectedLabelIds, setSelectedLabelIds] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isColorPickerMode, setIsColorPickerMode] = useState(false)
    const [editingLabel, setEditingLabel] = useState(null)

    // Get available labels from taskService.getLabels
    const availableLabels = taskService.getLabels(board, groupId, taskId)

    // Get current task labels
    useEffect(() => {
        const task = taskService.getTaskById(board, groupId, taskId)
        if (task?.labels && Array.isArray(task.labels)) {
            const labelIds = task.labels.map(label => label.id || label.color)
            setSelectedLabelIds(labelIds)
        }
    }, [board, groupId, taskId])

    async function toggleLabel(labelId) {
        setSelectedLabelIds(prev => {
            const isSelected = prev.includes(labelId)
            const newSelection = isSelected
                ? prev.filter(id => id !== labelId)
                : [...prev, labelId]
            
            // Update task labels
            const selectedLabels = availableLabels.filter(label => 
                newSelection.includes(label.id || label.color)
            )
            const updatedBoard = taskService.updateTask(board, groupId, taskId, { labels: selectedLabels })
            boardService.save(updatedBoard)
            
            return newSelection
        })
    }

    function isLabelSelected(label) {
        const labelId = label.id || label.color
        return selectedLabelIds.includes(labelId)
    }

    const filteredLabels = availableLabels.filter(label =>
        label.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        label.color?.toLowerCase().includes(searchTerm.toLowerCase())
    )

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

    function handleLabelSave(updatedLabel) {
        // Refresh the component or update state as needed
        closeColorPicker()
    }
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>×</button>
                
                {isColorPickerMode ? (
                    <ColorPicker
                        board={board}
                        groupId={groupId}
                        taskId={taskId}
                        label={editingLabel}
                        onClose={closeColorPicker}
                        onSave={handleLabelSave}
                    />
                ) : (
                    <>
                        <h3>Labels</h3>
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
                            <button onClick={createNewLabel}>Create a new label</button>
                        </div>
                        
                        <div className="popup-body">
                            {filteredLabels.map((label) => {
                                const labelId = label.id || label.color
                                const isSelected = isLabelSelected(label)
                                return (
                                    <div 
                                        key={labelId} 
                                        className={`label-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleLabel(labelId)}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected}
                                            onChange={() => toggleLabel(labelId)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
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
                        <button onClick={onClose}>Close</button>
                        <button onClick={() => {
                            const selectedLabels = availableLabels.filter(label => 
                                selectedLabelIds.includes(label.id || label.color)
                            )
                            onSave('labels', selectedLabels)
                        }}>Save</button>
                    </>
                )}
            </div>
        </div>
    )
}
