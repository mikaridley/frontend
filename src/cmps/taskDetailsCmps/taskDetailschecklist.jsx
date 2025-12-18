import { useState } from 'react'
import { taskService } from '../../services/task/task.service.local'
import { boardService } from '../../services/board'
import { showErrorMsg } from '../../services/event-bus.service'

export function TaskDetailsChecklist({ board, groupId, taskId, onClose, onSave }) {
    const [checklistTitle, setChecklistTitle] = useState('')
    
    const task = taskService.getTaskById(board, groupId, taskId)
    const existingChecklists = task?.checklists || []

    function handleSave(ev) {
        ev.preventDefault()
        if (!checklistTitle.trim()) return
        
        const newChecklist = {
            id: Date.now().toString(),
            name: checklistTitle,
            items: []
        }
        
        const updatedChecklists = [...existingChecklists, newChecklist]
        onSave('checklists', updatedChecklists)
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h4>Add checklist</h4> 
                <button className="popup-close" onClick={onClose}>X</button>
                <div className="popup-body">
                    <h6>Title</h6>
                    <form onSubmit={handleSave}>
                        <input 
                            type="text" 
                            placeholder="Add checklist..." 
                            value={checklistTitle}
                            onChange={(e) => setChecklistTitle(e.target.value)}
                            autoFocus
                        />
                        <button type="submit">Add</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

// Utility functions for managing checklist items
export async function addItemToChecklist(checklistId, newItemText, checklists, board, groupId, taskId, task, setChecklists, setTask, setBoard) {
    if (!newItemText.trim()) return false
    
    try {
        const updatedChecklists = checklists.map(checklist => {
            if (checklist.id === checklistId) {
                const newItem = {
                    text: newItemText,
                    isChecked: false
                }
                return {
                    ...checklist,
                    items: [...(checklist.items || []), newItem]
                }
            }
            return checklist
        })
        
        setChecklists(updatedChecklists)
        setTask({ ...task, checklists: updatedChecklists })
        const updatedBoard = taskService.updateTask(board, groupId, taskId, { checklists: updatedChecklists })
        await boardService.save(updatedBoard)
        setBoard(updatedBoard)
        return true
    } catch (err) {
        console.log('Error adding checklist item:', err)
        showErrorMsg('Cannot add item')
        return false
    }
}
