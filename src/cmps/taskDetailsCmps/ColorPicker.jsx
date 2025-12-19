import { useState } from 'react'
import { taskService } from '../../services/task/task.service.local'
import { boardService } from '../../services/board'


const colorPalette = [
    {'color': '#2d5a4a', 'title': 'subtle Green'}, {'color': '#5d4d1f', 'title': 'subtle yellow'}, {'color': '#6b3c1e', 'title': 'subtle orange'}, {'color': '#5e2828', 'title': 'subtle red'}, {'color': '#4a2d5a', 'title': 'subtle purple'},
    {'color': '#3d6e5a', 'title': 'green'}, {'color': '#8b7534', 'title': 'yellow'}, {'color': '#a0652d', 'title': 'orange'}, {'color': '#b85745', 'title': 'red'}, {'color': '#7d5ba6', 'title': 'purple'},
    {'color': '#7fccb3', 'title': 'bold green'}, {'color': '#d4a944', 'title': 'bold yellow'}, {'color': '#f9a847', 'title': 'bold orange'}, {'color': '#ff9d88', 'title': 'bold red'}, {'color': '#c4a3ff', 'title': 'bold purple'},
    {'color': '#1a3a6b', 'title': 'subtle blue'}, {'color': '#2d5866', 'title': 'subtle sky'}, {'color': '#4a5a2d', 'title': 'subtle lime'}, {'color': '#5a3047', 'title': 'subtle pink'}, {'color': '#4a4a4a', 'title': 'subtle black'},
    {'color': '#3d6bb3', 'title': 'blue'}, {'color': '#4a8a9d', 'title': 'sky'}, {'color': '#6b8c3d', 'title': 'lime'}, {'color': '#a35a8c', 'title': 'pink'}, {'color': '#7a7a7a', 'title': 'black'},
    {'color': '#7fa8e5', 'title': 'bold blue'}, {'color': '#7fd4e5', 'title': 'bold sky'}, {'color': '#b3d97f', 'title': 'bold lime'}, {'color': '#ff9dcc', 'title': 'bold pink'}, {'color': '#b3b3b3', 'title': 'bold black'}
]

export function ColorPicker({ board, groupId, taskId, label, onClose, onSave }) {
    const [labelTitle, setLabelTitle] = useState(label?.title || '')
    const [labelColor, setLabelColor] = useState(   //current selected label color
        label?.color //if label has a color, find the color in the color palette, if not, use the first color
            ? colorPalette.find(c => c.color === label.color) || colorPalette[0]    
            : colorPalette[0]
    )
    const isEditMode = !!label

    async function handleSave() {
        if (!labelTitle.trim()) return

        const updatedLabel = {
            ...(label || {}),
            title: labelTitle,
            color: labelColor.color
        }

        // If editing existing label
        if (isEditMode) {
            // Update task labels if this label is selected
            const task = taskService.getTaskById(board, groupId, taskId)
            if (task?.labels) {
                const taskLabelIndex = task.labels.findIndex(l => 
                    (l.id && l.id === label.id) || 
                    (!l.id && l.color === label.color)
                )
                if (taskLabelIndex > -1) {
                    const updatedTaskLabels = [...task.labels]
                    updatedTaskLabels[taskLabelIndex] = updatedLabel
                    const updatedBoard = taskService.updateTask(board, groupId, taskId, { labels: updatedTaskLabels })
                    await boardService.save(updatedBoard)
                }
            }

            // Update board labels if they exist
            if (board?.labels) {
                const boardLabelIndex = board.labels.findIndex(l =>     //find which label in the board matches the one we're editing
                    (l.id && l.id === label.id) || 
                    (!l.id && l.color === label.color)
                )
                if (boardLabelIndex > -1) { //if the label is found, update it (>-1 means found`)
                    const updatedBoardLabels = [...board.labels]
                    updatedBoardLabels[boardLabelIndex] = updatedLabel
                    board.labels = updatedBoardLabels
                    await boardService.save(board)
                }
            }
        } else {
            // Creating new label - add to board labels
            if (board?.labels) {
                const newLabel = {
                    id: `l${Date.now()}`,
                    title: labelTitle,
                    color: labelColor.color
                }
                board.labels.push(newLabel)
                await boardService.save(board)
            }
        }

        if (onSave) onSave(updatedLabel)
        if (onClose) onClose()
    }

    return (
        <div className="color-picker-menu">
            <div className="color-picker-header">
                <h4>{isEditMode ? 'Edit Label' : 'Create Label'}</h4>
                <button className="popup-close" onClick={onClose}>×</button>
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
                            <div
                                key={idx}
                                className={`color-swatch ${labelColor.color === colorObj.color ? 'selected' : ''}`}
                                style={{ backgroundColor: colorObj.color }}
                                onClick={() => setLabelColor(colorObj)}
                                title={colorObj.title}
                            />
                        ))}
                    </div>
                </div>
                <div className="color-picker-actions">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

