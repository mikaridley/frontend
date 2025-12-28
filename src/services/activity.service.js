import { makeId } from './util.service'
import { store } from '../store/store'

/**
 * activity types - the 30 activities we defined
 */
export const ACTIVITY_TYPES = {
  // Board
  BOARD_CREATED: 'BOARD_CREATED',
  BOARD_TITLE_CHANGED: 'BOARD_TITLE_CHANGED',
  BOARD_BACKGROUND_CHANGED: 'BOARD_BACKGROUND_CHANGED',
  MEMBER_ADDED_TO_BOARD: 'MEMBER_ADDED_TO_BOARD',
  MEMBER_REMOVED_FROM_BOARD: 'MEMBER_REMOVED_FROM_BOARD',
  
  // Groups
  GROUP_CREATED: 'GROUP_CREATED',
  GROUP_RENAMED: 'GROUP_RENAMED',
  GROUP_ARCHIVED: 'GROUP_ARCHIVED',
  
  // Tasks
  TASK_CREATED: 'TASK_CREATED',
  TASK_TITLE_CHANGED: 'TASK_TITLE_CHANGED',
  TASK_MOVED: 'TASK_MOVED',
  TASK_TRANSFERRED: 'TASK_TRANSFERRED',
  TASK_DELETED: 'TASK_DELETED',
  
  // Task Details
  MEMBER_ADDED_TO_TASK: 'MEMBER_ADDED_TO_TASK',
  MEMBER_REMOVED_FROM_TASK: 'MEMBER_REMOVED_FROM_TASK',
  LABEL_ADDED_TO_TASK: 'LABEL_ADDED_TO_TASK',
  LABEL_REMOVED_FROM_TASK: 'LABEL_REMOVED_FROM_TASK',
  DUE_DATE_ADDED: 'DUE_DATE_ADDED',
  DUE_DATE_CHANGED: 'DUE_DATE_CHANGED',
  DUE_DATE_REMOVED: 'DUE_DATE_REMOVED',
  ATTACHMENT_ADDED: 'ATTACHMENT_ADDED',
  ATTACHMENT_REMOVED: 'ATTACHMENT_REMOVED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  COMMENT_REMOVED: 'COMMENT_REMOVED',
  CHECKLIST_ADDED: 'CHECKLIST_ADDED',
  CHECKLIST_REMOVED: 'CHECKLIST_REMOVED',
  CHECKLIST_ITEM_COMPLETED: 'CHECKLIST_ITEM_COMPLETED',
  CHECKLIST_ITEM_UNCHECKED: 'CHECKLIST_ITEM_UNCHECKED',
  COVER_ADDED: 'COVER_ADDED',
  COVER_REMOVED: 'COVER_REMOVED',
}

export function logActivity(board, actionType, details = {}) {
  if (!board) return board
  
  // get current user from store
  const { loggedinUser } = store.getState().userModule
  if (!loggedinUser) return board
  
  // initialize activities array if it doesn't exist
  if (!board.activities) {
    board.activities = []
  }
  const isCommentActivity = [
    ACTIVITY_TYPES.COMMENT_ADDED,
    ACTIVITY_TYPES.COMMENT_REMOVED
  ].includes(actionType)

  // create activity entry
  const activity = {
    id: makeId(),
    type: actionType,
    category: isCommentActivity ? 'comment' : 'all',
    userId: loggedinUser._id || loggedinUser.id,
    userFullname: loggedinUser.fullname || 'Unknown',
    userImgUrl: loggedinUser.imgUrl || '',
    timestamp: Date.now(),
    ...details, // include any additional details (taskTitle, groupTitle, etc.)
  }
  
  // append to activities array
  board.activities.push(activity)
  
  return board
}