import { taskService } from '../services/task'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../services/event-bus.service.js'
import { loadBoard } from '../store/actions/board.actions'
import { updateTask } from '../store/actions/task.actions'
import { TaskDetailsComments } from './taskDetailsCmps/TaskDetailsComments'
import { TaskDetailsActions } from './taskDetailsCmps/TaskDetailsActions'
import { TaskDetailsHeader } from './taskDetailsCmps/TaskDetailsHeader'
import { TaskDetailsDescription } from './taskDetailsCmps/TaskDetailsDescription'
import { TaskDetailsData } from './taskDetailsCmps/TaskDetailsData'
import { TaskDetailsPopupManager } from './taskDetailsCmps/TaskDetailsPopupManager'
import { TaskDetailsChecklistManager } from './taskDetailsCmps/TaskDetailsChecklistManager'
import { TaskDetailsCover } from './taskDetailsCmps/TaskDetailsCover'


export function TaskDetails() {
    const { boardId, groupId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)
    const [task, setTask] = useState(null)
    const [activePopup, setActivePopup] = useState(null)
    const navigate = useNavigate()
    const [comments, setComments] = useState([])
    const [members, setMembers] = useState([])
    const [labels, setLabels] = useState([])
    const [checklists, setChecklists] = useState([])
    const [dates, setDates] = useState(null)
    const [attachments, setAttachments] = useState([])
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })



  useEffect(() => {
    if (boardId) {
      loadBoard(boardId)
    }
  }, [boardId])

    useEffect(() => {
        if (board && groupId && taskId) {
            const task = taskService.getTaskById(board, groupId, taskId)
            if (task) {
                setTask(task)
                setComments(task?.comments || [])
                setMembers(task?.members || [])
                setLabels(task?.labels || [])
                setChecklists(task?.checklists || [])
                setDates(task?.dates || null)
                setAttachments(task?.attachments || [])
            } else {
                showErrorMsg('Task not found')
                navigate(`/board/${boardId}`)
            }
        }
    }, [board, groupId, taskId, navigate])

  function openPopup(popupName, event) {
    setActivePopup(popupName)
    // Store button position for popup positioning
    if (event?.currentTarget) {
      const buttonRect = event.currentTarget.getBoundingClientRect()
      setPopupPosition({
        top: buttonRect.bottom + 8, // 8px gap below button
        left: buttonRect.left,
      })
    }
  }

  function closePopup() {
    setActivePopup(null)
  }

    async function savePopup(popupName, data) {
        if (!board) return
        try {
            await updateTask(board, groupId, taskId, { [popupName]: data })
            setTask(prevTask => ({ ...prevTask, [popupName]: data }))
            // Update the corresponding state
            if (popupName === 'checklists') {
                setChecklists(data)
            } else if (popupName === 'labels') {
                setLabels(data)
            } else if (popupName === 'members') {
                setMembers(data)
            } else if (popupName === 'dates') {
                setDates(data)
            } else if (popupName === 'attachments') {
                setAttachments(data)
            }

            console.log('Task updated:', { ...task, [popupName]: data })
            // Don't close popup for labels and members since they save immediately
            if (popupName !== 'labels' && popupName !== 'members') {
                closePopup()
            }
        } catch (err) {
            console.log('Error saving popup data:', err)
            showErrorMsg('Cannot save changes')
        }
    }

  function handleBackdropClick(ev) {
    if (ev.target === ev.currentTarget) {
      navigate(`/board/${boardId}`)
    }
  }

  if (!board) {
    return <div>Loading...</div>
  }

    return (
        <div className="task-details-modal" onClick={handleBackdropClick}>
            <div className="task-details">
                
                {/* Row 1: Reserved for future special header + functionality */}
                <TaskDetailsCover
                    task={task}
                    board={board}
                    groupId={groupId}
                    taskId={taskId}
                    onTaskUpdate={setTask}
                    onOpenPopup={openPopup}
                    attachments={attachments}
                    boardId={boardId}

                />
                {task && (
                    <>
                        <TaskDetailsHeader 
                            task={task} 
                            board={board} 
                            groupId={groupId} 
                            taskId={taskId}
                            onTaskUpdate={setTask}
                        />
                        <TaskDetailsActions onOpenPopup={openPopup} />
                    </>
                )}
                {task && (
                    <div className="task-details-comments">
                        <TaskDetailsComments
                            boardId={boardId}
                            groupId={groupId}
                            taskId={taskId}
                            board={board}
                            comments={comments}
                            onCommentsUpdate={(updatedComments) => {
                                setComments(updatedComments)
                                setTask({ ...task, comments: updatedComments })
                            }}
                        />
                    </div>
                )}
                <div className="task-details-content">
                    <div className="task-details-main">
                        <TaskDetailsData
                            members={members}
                            labels={labels}
                            attachments={attachments}
                            dates={dates}
                            board={board}
                            groupId={groupId}
                            taskId={taskId}
                            task={task}
                            onOpenPopup={openPopup}
                            onTaskUpdate={setTask}
                            onAttachmentsUpdate={setAttachments}
                        />

                        <TaskDetailsPopupManager
                            activePopup={activePopup}
                            popupPosition={popupPosition}
                            board={board}
                            groupId={groupId}
                            taskId={taskId}
                            dates={dates}
                            onOpenPopup={openPopup}
                            onClose={closePopup}
                            onSave={savePopup}
                        />

                        <TaskDetailsDescription
                            description={task?.description}
                            attachments={attachments}
                            board={board}
                            groupId={groupId}
                            taskId={taskId}
                            task={task}
                            onTaskUpdate={setTask}
                        />

                        <TaskDetailsChecklistManager
                            checklists={checklists}
                            board={board}
                            groupId={groupId}
                            taskId={taskId}
                            task={task}
                            onTaskUpdate={setTask}
                            onChecklistsUpdate={setChecklists}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
