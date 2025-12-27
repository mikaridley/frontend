import { useState, useEffect } from 'react'
import { TaskChecklistsDisplay } from './popups/taskDetailschecklist'
import { updateTask } from '../../store/actions/task.actions'
import { showErrorMsg } from "../../services/event-bus.service.js"

export function TaskDetailsChecklistManager({ checklists: initialChecklists, board, groupId, taskId, task, onTaskUpdate, onChecklistsUpdate }) {
    const [checklists, setChecklists] = useState(initialChecklists || [])
    const [addingItemToChecklist, setAddingItemToChecklist] = useState(null)
    const [newItemText, setNewItemText] = useState('')

    useEffect(() => {
        setChecklists(initialChecklists || [])
    }, [initialChecklists])

    async function toggleChecklistItem(checklistId, itemIndex) {
        if (!board) return
        try {
            const updatedChecklists = checklists.map(checklist => {
                if (checklist.id === checklistId) {
                    const updatedItems = checklist.items.map((item, index) => {
                        if (index === itemIndex) {
                            return { ...item, isChecked: !item.isChecked }
                        }
                        return item
                    })
                    return { ...checklist, items: updatedItems }
                }
                return checklist
            })

            setChecklists(updatedChecklists)
            onChecklistsUpdate(updatedChecklists)
            onTaskUpdate({ ...task, checklists: updatedChecklists })
            await updateTask(board, groupId, taskId, { checklists: updatedChecklists })
        } catch (err) {
            console.log('Error toggling checklist item:', err)
            showErrorMsg('Cannot update checklist')
        }
    }

    async function updateItemText(checklistId, itemIndex, newText) {
        if (!board) return
        try {
            const updatedChecklists = checklists.map(checklist => {
                if (checklist.id === checklistId) {
                    const updatedItems = checklist.items.map((item, index) => {
                        if (index === itemIndex) {
                            return { ...item, text: newText }
                        }
                        return item
                    })
                    return { ...checklist, items: updatedItems }
                }
                return checklist
            })

            setChecklists(updatedChecklists)
            onChecklistsUpdate(updatedChecklists)
            onTaskUpdate({ ...task, checklists: updatedChecklists })
            await updateTask(board, groupId, taskId, { checklists: updatedChecklists })
        } catch (err) {
            console.log('Error updating item text:', err)
            showErrorMsg('Cannot update item')
        }
    }

    async function updateChecklistName(checklistId, newName) {
        if (!board) return
        try {
            const updatedChecklists = checklists.map(checklist => {
                if (checklist.id === checklistId) {
                    return { ...checklist, name: newName }
                }
                return checklist
            })

            setChecklists(updatedChecklists)
            onChecklistsUpdate(updatedChecklists)
            onTaskUpdate({ ...task, checklists: updatedChecklists })
            await updateTask(board, groupId, taskId, { checklists: updatedChecklists })
        } catch (err) {
            console.log('Error updating checklist name:', err)
            showErrorMsg('Cannot update checklist name')
        }
    }

    function startAddingItem(checklistId) {
        setAddingItemToChecklist(checklistId)
        setNewItemText('')
    }

    function cancelAddingItem() {
        setAddingItemToChecklist(null)
        setNewItemText('')
    }

    async function handleAddItemToChecklist(checklistId) {
        if (!board) return
        
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

        try {
            setChecklists(updatedChecklists)
            onChecklistsUpdate(updatedChecklists)
            onTaskUpdate({ ...task, checklists: updatedChecklists })
            await updateTask(board, groupId, taskId, { checklists: updatedChecklists })
            // clear text and immediately start adding another item
            setNewItemText('')
            startAddingItem(checklistId)
        } catch (err) {
            console.log('Error adding checklist item:', err)
            showErrorMsg('Cannot add item')
        }
    }

    async function removeItem(checklistId, itemIndex) {
        if (!board) return
        try {
            const updatedChecklists = checklists.map(checklist => {
                if (checklist.id === checklistId) {
                    const updatedItems = checklist.items.filter((item, index) => index !== itemIndex)
                    return { ...checklist, items: updatedItems }
                }
                return checklist
            })

            setChecklists(updatedChecklists)
            onChecklistsUpdate(updatedChecklists)
            onTaskUpdate({ ...task, checklists: updatedChecklists })
            await updateTask(board, groupId, taskId, { checklists: updatedChecklists })
        } catch (err) {
            console.log('Error removing checklist item:', err)
            showErrorMsg('Cannot remove item')
        }
    }

    return (
        <TaskChecklistsDisplay
            checklists={checklists}
            onToggleItem={toggleChecklistItem}
            onUpdateItemText={updateItemText}
            onUpdateChecklistName={updateChecklistName}
            onRemoveItem={removeItem}
            addingItemToChecklist={addingItemToChecklist}
            newItemText={newItemText}
            onNewItemTextChange={setNewItemText}
            onStartAddingItem={startAddingItem}
            onCancelAddingItem={cancelAddingItem}
            onAddItem={handleAddItemToChecklist}
        />
    )
}

