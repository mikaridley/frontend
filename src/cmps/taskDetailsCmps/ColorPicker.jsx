import { useState } from 'react'
import { taskService } from '../../services/task'
import { boardService } from '../../services/board'
import { loadBoard } from '../../store/actions/board.actions'
import { LightTooltip } from '../LightToolTip'


const colorPalette = [
    { 'color': '#164B35', 'title': 'subtle Green' }, { 'color': '#533F04', 'title': 'subtle yellow' }, { 'color': '#693200', 'title': 'subtle orange' }, { 'color': '#5D1F1A', 'title': 'subtle red' }, { 'color': '#48245D', 'title': 'subtle purple' },
    { 'color': '#216E4E', 'title': 'green' }, { 'color': '#7F5F01', 'title': 'yellow' }, { 'color': '#9E4C00', 'title': 'orange' }, { 'color': '#AE2E24', 'title': 'red' }, { 'color': '#803FA5', 'title': 'purple' },
    { 'color': '#4BCE97', 'title': 'bold green' }, { 'color': '#DDB30E', 'title': 'bold yellow' }, { 'color': '#FCA700', 'title': 'bold orange' }, { 'color': '#F87168', 'title': 'bold red' }, { 'color': '#C97CF4', 'title': 'bold purple' },
    { 'color': '#123263', 'title': 'subtle blue' }, { 'color': '#164555', 'title': 'subtle sky' }, { 'color': '#37471F', 'title': 'subtle lime' }, { 'color': '#50253F', 'title': 'subtle pink' }, { 'color': '#4B4D51', 'title': 'subtle black' },
    { 'color': '#1558BC', 'title': 'blue' }, { 'color': '#206A83', 'title': 'sky' }, { 'color': '#4C6B1F', 'title': 'lime' }, { 'color': '#943D73', 'title': 'pink' }, { 'color': '#63666B', 'title': 'black' },
    { 'color': '#669DF1', 'title': 'bold blue' }, { 'color': '#6CC3E0', 'title': 'bold sky' }, { 'color': '#94C748', 'title': 'bold lime' }, { 'color': '#E774BB', 'title': 'bold pink' }, { 'color': '#96999E', 'title': 'bold black' }
]

export function ColorPicker({ board, groupId, taskId, label, onClose, onCloseAll, onSave, hideHeader }) {
    const [labelTitle, setLabelTitle] = useState(label?.title || '')
    const [labelColor, setLabelColor] = useState(   //current selected label color
        label?.color //if label has a color, find the color in the color palette, if not, use the first color
            ? colorPalette.find(c => c.color === label.color) || colorPalette[0]
            : colorPalette[0]
    )
    const isEditMode = !!label

    // Helper function to check if two labels match
    function labelsMatch(l1, l2) {
        return (l1.id && l2.id && l1.id === l2.id) || 
               (!l1.id && !l2.id && l1.color === l2.color)
    }

    async function handleSave() {
        if (!board || !board._id) {
            console.error('Cannot save label: board or board._id is missing')
            return
        }

        const updatedLabel = {
            ...(label || {}),
            title: labelTitle,
            color: labelColor.color,
            colorName: labelColor.title
        }

        let updatedBoard = { ...board }

        if (isEditMode) {
            // Update task labels if this label is selected
            const task = taskService.getTaskById(updatedBoard, groupId, taskId)
            if (task?.labels) {
                const taskLabelIndex = task.labels.findIndex(l => labelsMatch(l, label))
                if (taskLabelIndex > -1) {
                    const updatedTaskLabels = [...task.labels]
                    updatedTaskLabels[taskLabelIndex] = updatedLabel
                    // updateTask saves internally and returns the updated board
                    updatedBoard = await taskService.updateTask(updatedBoard, groupId, taskId, { labels: updatedTaskLabels })
                }
            }

            // Update board labels if they exist
            if (updatedBoard?.labels) {
                const boardLabelIndex = updatedBoard.labels.findIndex(l => labelsMatch(l, label))
                if (boardLabelIndex > -1) {
                    const updatedBoardLabels = [...updatedBoard.labels]
                    updatedBoardLabels[boardLabelIndex] = updatedLabel
                    updatedBoard.labels = updatedBoardLabels
                    await boardService.save(updatedBoard)
                }
            }
        } else {
            // Creating new label - add to board labels
            updatedBoard.labels = board.labels ? [...board.labels] : []
            
            // Initialize board.labels with default labels if it's empty
            if (updatedBoard.labels.length === 0) {
                updatedBoard.labels = [
                    { color: '#AE2E24', title: '', colorName: 'red' },
                    { color: '#DDB30E', title: '', colorName: 'bold yellow' },
                    { color: '#216E4E', title: '', colorName: 'green' },
                    { color: '#1558BC', title: '', colorName: 'blue' },
                    { color: '#C97CF4', title: '', colorName: 'bold purple' },
                    { color: '#7F5F01', title: '', colorName: 'yellow' }
                ]
            }

            const newLabel = {
                id: `l${Date.now()}`,
                title: labelTitle,
                color: labelColor.color,
                colorName: labelColor.title
            }
            updatedBoard.labels.push(newLabel)
            await boardService.save(updatedBoard)
        }

        // Reload the board to update Redux store and trigger re-render
        await loadBoard(board._id)

        if (onSave) onSave(updatedLabel)
        if (onClose) onClose()
    }

    async function handleDelete() {
        if (!isEditMode || !label || !board || !board._id) return

        let updatedBoard = { ...board }

        // Remove from task labels if this label is selected
        const task = taskService.getTaskById(updatedBoard, groupId, taskId)
        if (task?.labels) {
            const updatedTaskLabels = task.labels.filter(l => !labelsMatch(l, label))
            // updateTask saves internally and returns the updated board
            updatedBoard = await taskService.updateTask(updatedBoard, groupId, taskId, { labels: updatedTaskLabels })
        }

        // Remove from board labels if they exist
        if (updatedBoard?.labels) {
            const updatedBoardLabels = updatedBoard.labels.filter(l => !labelsMatch(l, label))
            updatedBoard.labels = updatedBoardLabels
            await boardService.save(updatedBoard)
        }

        // Reload the board to update Redux store and trigger re-render
        await loadBoard(board._id)

        if (onSave) onSave(null) // Notify parent that label was deleted
        if (onClose) onClose()
    }

    return (
        <div className="color-picker-menu">
            {!hideHeader && (
                <div className="color-picker-header">
                    <button className="color-picker-close" onClick={onClose}>
                        <span style={{ pointerEvents: 'none' }}>&lt;</span>
                    </button>
                    <h4>{isEditMode ? 'Edit Label' : 'Create Label'}</h4>
                    <button className="popup-close" onClick={onCloseAll || onClose}>×</button>
                </div>
            )}
            <div className="color-picker-preview">
                <div className="color-picker-preview-color" style={{ backgroundColor: labelColor.color }}></div>
            </div>
            <div className="color-picker-body">
                <h5>Title</h5>
                <input
                    type="text"
                    placeholder="Label name"
                    value={labelTitle}
                    onChange={(e) => setLabelTitle(e.target.value)}
                />
                <div className="color-picker-section">
                    <h5>Select a color</h5>
                    <div className="color-grid">
                        {colorPalette.map((colorObj, idx) => (
                            <LightTooltip key={idx} title={colorObj.title}>
                                <div
                                    className={`color-swatch ${labelColor.color === colorObj.color ? 'selected' : ''}`}
                                    style={{ backgroundColor: colorObj.color }}
                                    onClick={() => setLabelColor(colorObj)}
                                />
                            </LightTooltip>
                        ))}
                    </div>
                </div>
                <div className="color-picker-actions">
                <button className="color-picker-save" onClick={handleSave}>Save</button>
                    {isEditMode && (
                        <button className="color-picker-delete" onClick={handleDelete}>Delete</button>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

