import { useState, useMemo } from 'react'
import { PopUpHeader } from '../addBoardCmps/PopUpHeader'
import { getMemberInitials, formatTimestamp } from '../../services/util.service'
import { ACTIVITY_TYPES } from '../../services/activity.service'
import { useNavigate } from 'react-router-dom'

export function Activities({ board, onClose }) {
  const [filter, setFilter] = useState('all') // 'all' or 'comments'
  const navigate = useNavigate()
  // filter activities based on selected tab
  const filteredActivities = useMemo(() => {
    // Ensure activities is an array
    if (!board?.activities || !Array.isArray(board.activities)) return []
    
    // Filter out any invalid/null activities
    const validActivities = board.activities.filter(
      activity => activity && typeof activity === 'object'
    )
    
    if (filter === 'comments') {
      return validActivities.filter(
        activity => activity.category === 'comment'
      )
    }
    
    return validActivities
  }, [board?.activities, filter])

  // sort activities by timestamp (newest first)
  const sortedActivities = useMemo(() => {
    if (!Array.isArray(filteredActivities) || filteredActivities.length === 0) {
      return []
    }
    
    return [...filteredActivities].sort((a, b) => {
      // Handle missing or invalid timestamps
      const timestampA = a.timestamp || 0
      const timestampB = b.timestamp || 0
      
      // If timestamps are invalid, put them at the end
      if (isNaN(timestampA) && isNaN(timestampB)) return 0
      if (isNaN(timestampA)) return 1
      if (isNaN(timestampB)) return -1
      
      return timestampB - timestampA
    })
  }, [filteredActivities])

  function formatActivityMessage(activity) {
    const userName = activity.userFullname || 'Unknown'
    
    switch (activity.type) {
      // board activities
      case ACTIVITY_TYPES.BOARD_CREATED:
        return <>created this board</>
      case ACTIVITY_TYPES.BOARD_TITLE_CHANGED:
        return <>renamed this board from {activity.oldTitle} to {activity.newTitle}</>
      case ACTIVITY_TYPES.BOARD_BACKGROUND_CHANGED:
        return <>changed the board background</>
      case ACTIVITY_TYPES.MEMBER_ADDED_TO_BOARD:
        return (
          <>
            added{' '}
            {activity.memberName ? (
              <span className="activity-user-name">{activity.memberName}</span>
            ) : (
              'a member'
            )}{' '}
            to this board
          </>
        )
      case ACTIVITY_TYPES.MEMBER_REMOVED_FROM_BOARD:
        return (
          <>
            removed{' '}
            {activity.memberName ? (
              <span className="activity-user-name">{activity.memberName}</span>
            ) : (
              'a member'
            )}{' '}
            from this board
          </>
        )
      
      // group activities
      case ACTIVITY_TYPES.GROUP_CREATED:
        return <>created list {activity.groupTitle}</>
      case ACTIVITY_TYPES.GROUP_RENAMED:
        return <>renamed list {activity.oldTitle} to {activity.newTitle}</>
      case ACTIVITY_TYPES.GROUP_ARCHIVED:
        return <>archived list {activity.groupTitle}</>
      
      // task activities
      case ACTIVITY_TYPES.TASK_CREATED:
        return <>added "{activity.taskTitle}" to <div onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.groupTitle}</div></>
      case ACTIVITY_TYPES.TASK_TITLE_CHANGED:
        return <>renamed "{activity.oldTitle}" to "{activity.taskTitle}" in <div onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.groupTitle}</div></>
      case ACTIVITY_TYPES.TASK_MOVED:
        return <>moved "{activity.taskTitle}" from {activity.fromGroupId} to <div onClick={() => navigate(`/board/${board._id}/${activity.toGroupId}`)}>{activity.toGroupTitle}</div></>
      case ACTIVITY_TYPES.TASK_TRANSFERRED:
        return <>transferred "{activity.taskTitle}" to another board</>
      case ACTIVITY_TYPES.TASK_DELETED:
        return <>deleted "{activity.taskTitle}" from <div onClick={() => navigate(`/board/${board._id}/${activity.groupId}`)}>{activity.groupTitle}</div></>
      case ACTIVITY_TYPES.TASK_ARCHIVED:
        return <>archived {activity.taskTitle} from {activity.groupTitle}</>
      case ACTIVITY_TYPES.TASK_UNARCHIVED:
        return <>unarchived {activity.taskTitle}</>
      case ACTIVITY_TYPES.TASK_FINISHED:
        return <>marked <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div> as complete</>
      case ACTIVITY_TYPES.TASK_UNFINISHED:
        return <>marked <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div> as incomplete</>
      // Task detail activities
      case ACTIVITY_TYPES.MEMBER_ADDED_TO_TASK:
        return (
          <>
            added{' '}
            {activity.memberName ? (
              <span className="activity-user-name">{activity.memberName}</span>
            ) : (
              'a member'
            )}{' '}
            to <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div>
          </>
        )
      case ACTIVITY_TYPES.MEMBER_REMOVED_FROM_TASK:
        return (
          <>
            removed{' '}
            {activity.memberName ? (
              <span className="activity-user-name">{activity.memberName}</span>
            ) : (
              'a member'
            )}{' '}
            from <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div>
          </>
        )
      case ACTIVITY_TYPES.LABEL_ADDED_TO_TASK:
        return <>added label "{activity.labelTitle}" to <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.LABEL_REMOVED_FROM_TASK:
        return <>removed label "{activity.labelTitle}" from <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.DUE_DATE_ADDED:
        return <>set due date for <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.DUE_DATE_CHANGED:
        return <>changed due date for <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.DUE_DATE_REMOVED:
        return <>removed due date from <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div> </>
      case ACTIVITY_TYPES.ATTACHMENT_ADDED:
        return <>added attachment "{activity.attachmentName}" to <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.ATTACHMENT_REMOVED:
        return <>removed attachment "{activity.attachmentName}" from <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.COMMENT_ADDED:
        return <>commented on <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.COMMENT_REMOVED:
        return <>removed a comment from <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.CHECKLIST_ADDED:
        return <>added checklist "{activity.checklistName}" to <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.CHECKLIST_REMOVED:
        return <>removed checklist "{activity.checklistName}" from <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.CHECKLIST_ITEM_COMPLETED:
        return <>completed an item in <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.CHECKLIST_ITEM_UNCHECKED:
        return <>unchecked an item in <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.COVER_ADDED:
        return <>added cover to <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      case ACTIVITY_TYPES.COVER_REMOVED:
        return <>removed cover from <div className="activity-link" onClick={() => navigate(`/board/${board._id}/${activity.groupId}/${activity.taskId}`)}>{activity.taskTitle}</div></>
      
      default:
        return <>performed an action</>
    }
  }


  return (
    <div className="activities-container">
      <PopUpHeader 
        onBack={onClose}
        onClose={onClose}
        header="Activity"
      />
      
      <div className="activities-tabs">
        <button
          className={`activities-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`activities-tab ${filter === 'comments' ? 'active' : ''}`}
          onClick={() => setFilter('comments')}
        >
          Comments
        </button>
      </div>

      <div className="activities-list">
        {sortedActivities.length === 0 ? (
          <div className="activities-empty">
            <p>No activities yet</p>
          </div>
        ) : (
          sortedActivities.map((activity, index) => (
            <div key={activity.id || activity._id || `activity-${index}`} className="activity-item">
              <div className="activity-avatar">
                {activity.userImgUrl ? (
                  <img src={activity.userImgUrl} alt={activity.userFullname} />
                ) : (
                  <div className="activity-avatar-initials">
                    {getMemberInitials(activity.userFullname)}
                  </div>
                )}
              </div>
              
              <div className="activity-content">
                <div className="activity-message">
                  <span className="activity-user-name">{activity.userFullname}</span>
                  {' '}
                  <span className="activity-action">{formatActivityMessage(activity)}</span>
                </div>
                <div className="activity-timestamp">
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

