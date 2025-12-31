import { useState, useEffect, useRef } from 'react'
import { taskService } from '../../../services/task'
import { showErrorMsg } from '../../../services/event-bus.service'
import { updateTask } from '../../../store/actions/task.actions'
import { popupToViewportHook } from '../../../customHooks/popupToViewportHook'
import checklistIcon from '../../../assets/imgs/icons/checkbox.svg'

//responsible for adding a new checklist
export function TaskDetailsChecklist({ board, groupId, taskId, onClose, onSave, position }) {
    const [checklistTitle, setChecklistTitle] = useState('')
    const popupRef = useRef(null)
    
    const task = taskService.getTaskById(board, groupId, taskId)
    const existingChecklists = task?.checklists || []

  // keep popup fully visible vertically
  popupToViewportHook(popupRef, position)

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
            <div 
                ref={popupRef}
                className="popup-content popup-checklists" 
                onClick={(e) => e.stopPropagation()}
                style={position ? {
                    top: `${position.top}px`,
                    left: `${position.left}px`
                } : {}}
            >
                <h4>Add checklist</h4> 
                <button className="popup-close" onClick={onClose}>×</button>
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

// reusable edit form component for checklist items and names
function EditForm({ value, onSave, onCancel, className = "edit-item-form" }) {
    const [text, setText] = useState(value)

    useEffect(() => {
        setText(value)
    }, [value])

    function handleSave() {
        if (text.trim()) {
            onSave(text.trim())
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSave()
        } else if (e.key === 'Escape') {
            onCancel()
        }
    }

    return (
        <div className={className}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <div className="edit-item-buttons">
                <button className="btn-save-item" onClick={handleSave}>
                    Save
                </button>
                <button className="btn-cancel-item" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

// display checklists and their progressbar and items
export function TaskChecklistsDisplay({
    checklists,
    onToggleItem,
    onUpdateItemText,
    onUpdateChecklistName,
    onRemoveItem,
    onRemoveChecklist,
    addingItemToChecklist,
    newItemText,
    onNewItemTextChange,
    onStartAddingItem,
    onCancelAddingItem,
    onAddItem
}) {
    const [editing, setEditing] = useState(null) 

    if (checklists.length === 0) return null

    function startEdit(type, checklistId, initialValue, itemIndex = null) {
        setEditing({ type, checklistId, itemIndex, initialValue })
    }

    function cancelEdit() {
        setEditing(null)
    }

    function saveEdit(newValue) {
        if (!editing) return
        
        if (editing.type === 'name') {
            onUpdateChecklistName(editing.checklistId, newValue)
        } else if (editing.type === 'item') {
            onUpdateItemText(editing.checklistId, editing.itemIndex, newValue)
        }
        cancelEdit()
    }

    function handleRemoveItem(checklistId, itemIndex) {
        onRemoveItem(checklistId, itemIndex)
    }

    return (
        <div className="checklists">
            {checklists.map(checklist => {
                const isEditingName = editing?.type === 'name' && editing.checklistId === checklist.id
                const items = checklist.items || []
                const checkedCount = items.filter(item => item.isChecked).length
                const totalCount = items.length
                const progressPercentage = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0
                
                return (
                <div key={checklist.id} className="checklist">
                    {isEditingName ? (
                        <input
                            type="text"
                            className="edit-checklist-name-input"
                            value={editing.initialValue}
                            onChange={(e) => {
                                setEditing({ ...editing, initialValue: e.target.value })
                            }}
                            onBlur={() => {
                                if (editing.initialValue.trim()) {
                                    saveEdit(editing.initialValue.trim())
                                } else {
                                    cancelEdit()
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Escape') {
                                    e.preventDefault()
                                    if (editing.initialValue.trim()) {
                                        saveEdit(editing.initialValue.trim())
                                    } else {
                                        cancelEdit()
                                    }
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <div className="checklist-name">
                        <img src={checklistIcon} className="checklist-icon" />
                        <h6 onClick={() => startEdit('name', checklist.id, checklist.name)}>{checklist.name}</h6>
                        <button className="btn-delete-checklist" onClick={() => onRemoveChecklist(checklist.id)}>Delete</button>
                        </div>
                    )}
                    <div className="checklist-progress">
                        <span className="progress-percentage">
                            {progressPercentage.toFixed(0)}%
                        </span>
                        <progress 
                            value={progressPercentage} 
                            max="100"
                            className={progressPercentage === 100 ? 'complete' : ''}
                        ></progress>
                    </div>
                    {checklist.items && checklist.items.map((item, index) => {
                        const isEditingItem = editing?.type === 'item' && editing.checklistId === checklist.id && editing.itemIndex === index
                        return (
                            <div key={index} className="checklist-item">
                                <input
                                    type="checkbox"
                                    checked={item.isChecked || false}
                                    onChange={() => onToggleItem(checklist.id, index)}
                                />
                                {isEditingItem ? (
                                    <input
                                        type="text"
                                        className="edit-item-form"
                                        value={editing.initialValue}
                                        onChange={(e) => {
                                            setEditing({ ...editing, initialValue: e.target.value })
                                        }}
                                        onBlur={() => {
                                            if (editing.initialValue.trim()) {
                                                saveEdit(editing.initialValue.trim())
                                            } else {
                                                cancelEdit()
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === 'Escape') {
                                                e.preventDefault()
                                                if (editing.initialValue.trim()) {
                                                    saveEdit(editing.initialValue.trim())
                                                } else {
                                                    cancelEdit()
                                                }
                                            }
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <span 
                                            className="checklist-item-text"
                                            onClick={() => startEdit('item', checklist.id, item.text, index)}
                                        >
                                            {item.text}
                                        </span>
                                        <button className="btn-remove-item" onClick={() => handleRemoveItem(checklist.id, index)}>remove</button>
                                    </>
                                )}
                            </div>
                        )
                    })}

                    {addingItemToChecklist === checklist.id ? (
                        <div className="add-item-form">
                            <input
                                type="text"
                                placeholder="Add an item"
                                value={newItemText}
                                onChange={(e) => onNewItemTextChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        onAddItem(checklist.id)
                                    }
                                }}
                                autoFocus
                            />
                            <div className="add-item-buttons">
                                <button
                                    className="btn-add-item"
                                    onClick={() => onAddItem(checklist.id)}
                                >
                                    Add
                                </button>
                                <button
                                    className="btn-cancel-item"
                                    onClick={onCancelAddingItem}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="btn-add-item-trigger"
                            onClick={() => onStartAddingItem(checklist.id)}
                        >
                            Add an item
                        </button>
                    )}
                </div>
            )})}
        </div>
    )
}

// utility functions for managing checklist items
export async function addItemToChecklist(checklistId, newItemText, checklists, board, groupId, taskId, task, setChecklists, setTask) {
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
        await updateTask(board, groupId, taskId, { checklists: updatedChecklists })
        return true
    } catch (err) {
        console.log('Error adding checklist item:', err)
        showErrorMsg('Cannot add item')
        return false
    }
}

