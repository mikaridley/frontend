import { useState, useEffect } from 'react'
import { TaskChecklistsDisplay } from './popups/taskDetailschecklist'
import { useChecklistUpdate } from '../../customHooks/useChecklistUpdate'

export function TaskDetailsChecklistManager({ checklists: initialChecklists, board, groupId, taskId, task, onTaskUpdate, onChecklistsUpdate }) {
    const [checklists, setChecklists] = useState(initialChecklists || [])
    const [addingItemToChecklist, setAddingItemToChecklist] = useState(null)
    const [newItemText, setNewItemText] = useState('')

    // custom hook to handle checklist updates with consistent pattern
    const updateChecklists = useChecklistUpdate({
        checklists,
        setChecklists,
        onChecklistsUpdate,
        onTaskUpdate,
        task,
        board,
        groupId,
        taskId
    })

    useEffect(() => {
        setChecklists(initialChecklists || [])
    }, [initialChecklists])

    async function toggleChecklistItem(checklistId, itemIndex) {
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

        await updateChecklists(updatedChecklists, 'Cannot update checklist')
    }

    async function updateItemText(checklistId, itemIndex, newText) {
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

        await updateChecklists(updatedChecklists, 'Cannot update item')
    }

    async function updateChecklistName(checklistId, newName) {
        const updatedChecklists = checklists.map(checklist => {
            if (checklist.id === checklistId) {
                return { ...checklist, name: newName }
            }
            return checklist
        })

        await updateChecklists(updatedChecklists, 'Cannot update checklist name')
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
            await updateChecklists(updatedChecklists, 'Cannot add item')
            // clear text and immediately start adding another item
            setNewItemText('')
            startAddingItem(checklistId)
        } catch (err) {
            // error already handled in updateChecklists hook
        }
    }

    async function removeItem(checklistId, itemIndex) {
        const updatedChecklists = checklists.map(checklist => {
            if (checklist.id === checklistId) {
                const updatedItems = checklist.items.filter((item, index) => index !== itemIndex)
                return { ...checklist, items: updatedItems }
            }
            return checklist
        })

        await updateChecklists(updatedChecklists, 'Cannot remove item')
    }

    async function removeChecklist(checklistId) {
        const updatedChecklists = checklists.filter(checklist => checklist.id !== checklistId)

        await updateChecklists(updatedChecklists, 'Cannot remove checklist')
    }

    return (
        <TaskChecklistsDisplay
            checklists={checklists}
            onToggleItem={toggleChecklistItem}
            onUpdateItemText={updateItemText}
            onUpdateChecklistName={updateChecklistName}
            onRemoveItem={removeItem}
            onRemoveChecklist={removeChecklist}
            addingItemToChecklist={addingItemToChecklist}
            newItemText={newItemText}
            onNewItemTextChange={setNewItemText}
            onStartAddingItem={startAddingItem}
            onCancelAddingItem={cancelAddingItem}
            onAddItem={handleAddItemToChecklist}
        />
    )
}
