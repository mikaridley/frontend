import { logActivity, ACTIVITY_TYPES } from '../activity.service'


export function logTaskActivities(updatedBoard, oldTask, changes, groupId, taskId) {
  if (!updatedBoard || !oldTask) return updatedBoard

  const newTask = updatedBoard.groups
    ?.find(g => g.id === groupId)
    ?.tasks?.find(t => t.id === taskId)
  const group = updatedBoard.groups?.find(g => g.id === groupId)

  // log task title change
  if (changes.title && oldTask?.title !== changes.title) {
    logActivity(updatedBoard, ACTIVITY_TYPES.TASK_TITLE_CHANGED, {
      taskId,
      taskTitle: changes.title,
      oldTitle: oldTask?.title,
      groupTitle: group?.title,
      groupId,
    })
  }

  // log member changes
  if (changes.members) {
    const added = changes.members.filter(
      m => !(oldTask?.members || [])?.some(om => (om._id || om.id) === (m._id || m.id))
    )
    const removed = (oldTask?.members || [])?.filter(
      m => !changes.members.some(nm => (nm._id || nm.id) === (m._id || m.id))
    ) || []

    added.forEach(member => {
      logActivity(updatedBoard, ACTIVITY_TYPES.MEMBER_ADDED_TO_TASK, {
        taskId,
        taskTitle: newTask?.title,
        memberName: member.fullname,
        groupTitle: group?.title,
        groupId,
      })
    })

    removed.forEach(member => {
      logActivity(updatedBoard, ACTIVITY_TYPES.MEMBER_REMOVED_FROM_TASK, {
        taskId,
        taskTitle: newTask?.title,
        memberName: member.fullname,
        groupTitle: group?.title,
        groupId,
      })
    })
  }

  // Log label changes
  if (changes.labels) {
    const added = changes.labels.filter(
      l => !(oldTask?.labels || [])?.some(ol => ol.id === l.id)
    )
    const removed = (oldTask?.labels || [])?.filter(
      l => !changes.labels.some(nl => nl.id === l.id)
    ) || []

    added.forEach(label => {
      logActivity(updatedBoard, ACTIVITY_TYPES.LABEL_ADDED_TO_TASK, {
        taskId,
        taskTitle: newTask?.title,
        labelTitle: label.title || label.color,
        groupTitle: group?.title,
        groupId,
      })
    })

    removed.forEach(label => {
      logActivity(updatedBoard, ACTIVITY_TYPES.LABEL_REMOVED_FROM_TASK, {
        taskId,
        taskTitle: newTask?.title,
        labelTitle: label.title || label.color,
        groupTitle: group?.title,
        groupId,
      })
    })
  }

  // Log due date changes
  if (changes.dates !== undefined) {
    if (!oldTask?.dates && changes.dates) {
      logActivity(updatedBoard, ACTIVITY_TYPES.DUE_DATE_ADDED, {
        taskId,
        taskTitle: newTask?.title,
        dueDate: changes.dates.dueDate,
        groupTitle: group?.title,
        groupId,
      })
    } else if (oldTask?.dates && !changes.dates) {
      logActivity(updatedBoard, ACTIVITY_TYPES.DUE_DATE_REMOVED, {
        taskId,
        taskTitle: newTask?.title,
        groupTitle: group?.title,
        groupId,
      })
    } else if (
      oldTask?.dates?.dueDate !== changes.dates?.dueDate &&
      changes.dates
    ) {
      logActivity(updatedBoard, ACTIVITY_TYPES.DUE_DATE_CHANGED, {
        taskId,
        taskTitle: newTask?.title,
        oldDueDate: oldTask.dates.dueDate,
        newDueDate: changes.dates.dueDate,
        groupTitle: group?.title,
        groupId,
      })
    }
  }

  // Log attachment changes
  if (changes.attachments) {
    const added = changes.attachments.filter(
      a => !(oldTask?.attachments || [])?.some(oa => oa.id === a.id)
    )
    const removed = (oldTask?.attachments || [])?.filter(
      a => !changes.attachments.some(na => na.id === a.id)
    ) || []

    added.forEach(attachment => {
      logActivity(updatedBoard, ACTIVITY_TYPES.ATTACHMENT_ADDED, {
        taskId,
        taskTitle: newTask?.title,
        attachmentName: attachment.name,
        groupTitle: group?.title,
        groupId,
      })
    })

    removed.forEach(attachment => {
      logActivity(updatedBoard, ACTIVITY_TYPES.ATTACHMENT_REMOVED, {
        taskId,
        taskTitle: newTask?.title,
        attachmentName: attachment.name,
        groupTitle: group?.title,
        groupId,
      })
    })
  }

  // Log comment changes
  if (changes.comments) {
    const added = changes.comments.filter(
      c => !(oldTask?.comments || [])?.some(oc => oc.id === c.id)
    )
    const removed = (oldTask?.comments || [])?.filter(
      c => !changes.comments.some(nc => nc.id === c.id)
    ) || []

    added.forEach(() => {
      logActivity(updatedBoard, ACTIVITY_TYPES.COMMENT_ADDED, {
        taskId,
        taskTitle: newTask?.title,
        groupTitle: group?.title,
        groupId,
      })
    })

    removed.forEach(() => {
      logActivity(updatedBoard, ACTIVITY_TYPES.COMMENT_REMOVED, {
        taskId,
        taskTitle: newTask?.title,
        groupTitle: group?.title,
        groupId,
      })
    })
  }

  // Log checklist changes
  if (changes.checklists) {
    const added = changes.checklists.filter(
      c => !(oldTask?.checklists || [])?.some(oc => oc.id === c.id)
    )
    const removed = (oldTask?.checklists || [])?.filter(
      c => !changes.checklists.some(nc => nc.id === c.id)
    ) || []

    added.forEach(checklist => {
      logActivity(updatedBoard, ACTIVITY_TYPES.CHECKLIST_ADDED, {
        taskId,
        taskTitle: newTask?.title,
        checklistName: checklist.name,
        groupTitle: group?.title,
        groupId,
      })
    })

    removed.forEach(checklist => {
      logActivity(updatedBoard, ACTIVITY_TYPES.CHECKLIST_REMOVED, {
        taskId,
        taskTitle: newTask?.title,
        checklistName: checklist.name,
        groupTitle: group?.title,
        groupId,
      })
    })

    // Log checklist item checked/unchecked changes
    const oldChecklists = oldTask?.checklists || []
    const newChecklists = changes.checklists || []
    
    // Check each checklist for item changes
    newChecklists.forEach(newChecklist => {
      const oldChecklist = oldChecklists.find(oc => oc.id === newChecklist.id)
      if (!oldChecklist) return // Skip if checklist is new (already logged above)
      
      const oldItems = oldChecklist.items || []
      const newItems = newChecklist.items || []
      
      // Check each item in the new checklist
      newItems.forEach((newItem, itemIndex) => {
        const oldItem = oldItems[itemIndex]
        
        // Only log if item exists in both old and new, and isChecked status changed
        if (oldItem && oldItem.text === newItem.text) {
          const wasChecked = oldItem.isChecked || false
          const isNowChecked = newItem.isChecked || false
          
          if (wasChecked !== isNowChecked) {
            if (isNowChecked) {
              logActivity(updatedBoard, ACTIVITY_TYPES.CHECKLIST_ITEM_COMPLETED, {
                taskId,
                taskTitle: newTask?.title,
                checklistName: newChecklist.name,
                itemText: newItem.text,
                groupTitle: group?.title,
                groupId,
              })
            } else {
              logActivity(updatedBoard, ACTIVITY_TYPES.CHECKLIST_ITEM_UNCHECKED, {
                taskId,
                taskTitle: newTask?.title,
                checklistName: newChecklist.name,
                itemText: newItem.text,
                groupTitle: group?.title,
                groupId,
              })
            }
          }
        }
      })
    })
  }

  // Log cover changes
  if (changes.cover !== undefined) {
    if (changes.cover && !oldTask?.cover) {
      logActivity(updatedBoard, ACTIVITY_TYPES.COVER_ADDED, {
        taskId,
        taskTitle: newTask?.title,
        groupTitle: group?.title,
        groupId,
      })
    } else if (!changes.cover && oldTask?.cover) {
      logActivity(updatedBoard, ACTIVITY_TYPES.COVER_REMOVED, {
        taskId,
        taskTitle: newTask?.title,
        groupTitle: group?.title,
        groupId,
      })
    }
  }

  return updatedBoard
}

