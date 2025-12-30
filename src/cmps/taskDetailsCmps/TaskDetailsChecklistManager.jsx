import { useState, useEffect } from 'react'
import { TaskChecklistsDisplay } from './popups/TaskDetailsChecklist'
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

    // update a checklist
    async function updateChecklist(checklistId, updateFn, errorMessage) {
        const updatedChecklists = checklists.map(checklist =>
            checklist.id === checklistId ? updateFn(checklist) : checklist
        )
        await updateChecklists(updatedChecklists, errorMessage)
    }

    // update an item in a checklist
    async function updateItem(checklistId, itemIndex, updateFn, errorMessage) {
        await updateChecklist(
            checklistId,
            (checklist) => ({
                ...checklist,
                items: checklist.items.map((item, index) =>
                    index === itemIndex ? updateFn(item) : item
                )
            }),
            errorMessage
        )
    }

    async function toggleChecklistItem(checklistId, itemIndex) {
        await updateItem(
            checklistId,
            itemIndex,
            (item) => ({ ...item, isChecked: !item.isChecked }),
            'Cannot update checklist'
        )
    }

    async function updateItemText(checklistId, itemIndex, newText) {
        await updateItem(
            checklistId,
            itemIndex,
            (item) => ({ ...item, text: newText }),
            'Cannot update item'
        )
    }

    async function updateChecklistName(checklistId, newName) {
        await updateChecklist(
            checklistId,
            (checklist) => ({ ...checklist, name: newName }),
            'Cannot update checklist name'
        )
    }

    async function handleAddItemToChecklist(checklistId) {
        try {
            await updateChecklist(
                checklistId,
                (checklist) => ({
                    ...checklist,
                    items: [...(checklist.items || []), {
                        text: newItemText,
                        isChecked: false
                    }]
                }),
                'Cannot add item'
            )
            setNewItemText('')
            startAddingItem(checklistId)
        } catch (err) {
            // error handled in updateChecklists hook
        }
    }

    async function removeItem(checklistId, itemIndex) {
        await updateChecklist(
            checklistId,
            (checklist) => ({
                ...checklist,
                items: checklist.items.filter((_, index) => index !== itemIndex)
            }),
            'Cannot remove item'
        )
    }

    async function removeChecklist(checklistId) {
        const updatedChecklists = checklists.filter(checklist => checklist.id !== checklistId)
        await updateChecklists(updatedChecklists, 'Cannot remove checklist')
    }

    function startAddingItem(checklistId) {
        setAddingItemToChecklist(checklistId)
        setNewItemText('')
    }

    function cancelAddingItem() {
        setAddingItemToChecklist(null)
        setNewItemText('')
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
