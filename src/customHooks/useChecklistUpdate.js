import { useCallback } from 'react'
import { updateTask } from '../store/actions/task.actions'
import { showErrorMsg } from '../services/event-bus.service'


export function useChecklistUpdate({
    checklists,
    setChecklists,
    onChecklistsUpdate,
    onTaskUpdate,
    task,
    board,
    groupId,
    taskId,
    errorMessage = 'Cannot update checklist'
}) {
    const updateChecklists = useCallback(async (updatedChecklists, customErrorMessage = null) => {
        if (!board) return

        // store previous state for rollback
        const previousChecklists = checklists

        try {
            // optimistic update - update all state immediately
            setChecklists(updatedChecklists)
            onChecklistsUpdate(updatedChecklists)
            onTaskUpdate({ ...task, checklists: updatedChecklists })

            // persist to backend
            await updateTask(board, groupId, taskId, { checklists: updatedChecklists })
        } catch (err) {
            // rollback on error
            setChecklists(previousChecklists)
            onChecklistsUpdate(previousChecklists)
            onTaskUpdate({ ...task, checklists: previousChecklists })

            console.log('Error updating checklists:', err)
            showErrorMsg(customErrorMessage || errorMessage)
            throw err
        }
    }, [
        checklists,
        setChecklists,
        onChecklistsUpdate,
        onTaskUpdate,
        task,
        board,
        groupId,
        taskId,
        errorMessage
    ])

    return updateChecklists
}

