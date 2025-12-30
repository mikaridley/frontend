import { TaskDetailsLabels } from './popups/TaskDetailsLabels'
import { TaskDetailsChecklist } from './popups/TaskDetailsChecklist'
import { TaskDetailsMembers } from './popups/TaskDetailsMembers'
import { TaskDetailsAdd } from './popups/TaskDetailsAdd'
import { TaskDetailsDates } from './popups/TaskDetailsDates'
import { TaskDetailsAttachments } from './popups/TaskDetailsAttachments'
import { TransferTask } from './popups/TransferTask'
import { TaskDetailsCoverPopup } from './popups/TaskDetailsCoverPopup'
const popupComponents = {
    labels: TaskDetailsLabels,
    checklists: TaskDetailsChecklist,
    members: TaskDetailsMembers,
    add: TaskDetailsAdd,
    dates: TaskDetailsDates,
    attachments: TaskDetailsAttachments,
    transferTask: TransferTask,
    cover: TaskDetailsCoverPopup
}

export function TaskDetailsPopupManager({ activePopup, popupPosition, board, groupId, taskId, dates, onOpenPopup, onClose, onSave }) {
    if (!activePopup) return null
    
    const Cmp = popupComponents[activePopup]
    if (!Cmp) return null

    const commonProps = {
        board,
        groupId,
        taskId,
        onClose,
        position: popupPosition
    }

    if (activePopup === 'add') {
        commonProps.onOpen = onOpenPopup  // needed to open the right popup from add popup
    }
    if (activePopup !== 'add') {
        commonProps.onSave = onSave
    }
    if (activePopup === 'dates') {
        commonProps.dates = dates
    }

    return <Cmp {...commonProps} />
}

