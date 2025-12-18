import { useState } from 'react'
import { taskService } from '../../services/task/task.service.local'
import { boardService } from '../../services/board'

// Color palette - 30 colors in 6 rows of 5 columns
const colorPalette = [
    '#2d5a4a', '#5d4d1f', '#6b3c1e', '#5e2828', '#4a2d5a',
    '#3d6e5a', '#8b7534', '#a0652d', '#b85745', '#7d5ba6',
    '#7fccb3', '#d4a944', '#f9a847', '#ff9d88', '#c4a3ff',
    '#1a3a6b', '#2d5866', '#4a5a2d', '#5a3047', '#4a4a4a',
    '#3d6bb3', '#4a8a9d', '#6b8c3d', '#a35a8c', '#7a7a7a',
    '#7fa8e5', '#7fd4e5', '#b3d97f', '#ff9dcc', '#b3b3b3'
]

export function ColorPicker({ board, groupId, taskId, label, onClose, onSave }) {
    const [labelTitle, setLabelTitle] = useState(label?.title || '')
    const [labelColor, setLabelColor] = useState(label?.color || colorPalette[0])
    const isEditMode = !!label

    async function handleSave() {
        if (!labelTitle.trim()) return

        const updatedLabel = {
            ...(label || {}),
            title: labelTitle,
            color: labelColor
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
                const boardLabelIndex = board.labels.findIndex(l => 
                    (l.id && l.id === label.id) || 
                    (!l.id && l.color === label.color)
                )
                if (boardLabelIndex > -1) {
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
                    color: labelColor
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
                        {colorPalette.map((color, idx) => (
                            <div
                                key={idx}
                                className={`color-swatch ${labelColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setLabelColor(color)}
                                title={color}
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

