import { TaskDetailsLabels } from './popups/taskDetailslabels'
import { TaskDetailsChecklist } from './popups/taskDetailschecklist'
import { TaskDetailsMembers } from './popups/taskDetailsmembers'
import { TaskDetailsAdd } from './popups/taskDetailsAdd'
import { TaskDetailsDates } from './popups/taskDetailsDates'
import { TaskDetailsAttachments } from './popups/taskDetailsAttachments'
import { TransferTask } from './popups/transferTask'
import { TaskDetailsCoverPopup } from './popups/taskDetailsCoverPopup'
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

