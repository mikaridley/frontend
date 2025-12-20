import { taskService } from '../services/task'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { showErrorMsg } from "../services/event-bus.service.js"
import { loadBoard } from '../store/actions/board.actions'
import { updateTask } from '../store/actions/task.actions.js'
import { TaskDetailsLabels } from './taskDetailsCmps/taskDetailslabels'
import { TaskDetailsChecklist, TaskChecklistsDisplay, addItemToChecklist } from './taskDetailsCmps/taskDetailschecklist'
import { TaskDetailsMembers } from './taskDetailsCmps/taskDetailsmembers'
import { TaskDetailsAdd } from './taskDetailsCmps/taskDetailsAdd'
import { TaskDetailsDates } from './taskDetailsCmps/taskDetailsDates'
import { TaskDetailsComments } from './taskDetailsCmps/TaskDetailsComments'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css';


export function TaskDetails() {
    const { boardId, groupId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)
    const [task, setTask] = useState(null)
    const [activePopup, setActivePopup] = useState(null)
    const navigate = useNavigate()
    const [description, setDescription] = useState('')
    const [descriptionEdit, setDescriptionEdit] = useState(false)
    const [comments, setComments] = useState([])
    const [members, setMembers] = useState([])
    const [labels, setLabels] = useState([])
    const [checklists, setChecklists] = useState([])
    const [dates, setDates] = useState(null)
    const [addingItemToChecklist, setAddingItemToChecklist] = useState(null)
    const [newItemText, setNewItemText] = useState('')
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })

    const popupComponents = {
        labels: TaskDetailsLabels,
        checklists: TaskDetailsChecklist,
        members: TaskDetailsMembers,
        add: TaskDetailsAdd,
        dates: TaskDetailsDates
    }

    function editDescription() {
        setDescriptionEdit(true)
    }

    async function saveDescription(ev) {
        ev.preventDefault()
        if (!board) return
        try {
            await updateTask(board, groupId, taskId, { description })
            setTask({ ...task, description })
            setDescriptionEdit(false)
        } catch (err) {
            console.log('Error saving description:', err)
            showErrorMsg('Cannot save description')
        }
    }



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
                setDescription(task?.description || '')
                setComments(task?.comments || [])
                setMembers(task?.members || [])
                setLabels(task?.labels || [])
                setChecklists(task?.checklists || [])
                setDates(task?.dates || null)
            } else {
                showErrorMsg('Task not found')
                navigate(`/board/${boardId}`)
            }
        }
    }, [board, groupId, taskId, navigate, boardId])

    function openPopup(popupName, event) {
        setActivePopup(popupName)
        // Store button position for popup positioning
        if (event?.currentTarget) {
            const buttonRect = event.currentTarget.getBoundingClientRect()
            setPopupPosition({
                top: buttonRect.bottom + 8, // 8px gap below button
                left: buttonRect.left
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
            setTask({ ...task, [popupName]: data })

            // Update the corresponding state
            if (popupName === 'checklists') {
                setChecklists(data)
            } else if (popupName === 'labels') {
                setLabels(data)
            } else if (popupName === 'members') {
                setMembers(data)
            } else if (popupName === 'dates') {
                setDates(data)
            }

            console.log('Task updated:', { ...task, [popupName]: data })
            closePopup()
        } catch (err) {
            console.log('Error saving popup data:', err)
            showErrorMsg('Cannot save changes')
        }
    }

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
            setTask({ ...task, checklists: updatedChecklists })
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
            setTask({ ...task, checklists: updatedChecklists })
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
            setTask({ ...task, checklists: updatedChecklists })
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
        const newChecklist = await addItemToChecklist(
            checklistId,
            newItemText,
            checklists,
            boardId,
            groupId,
            taskId,
            task,
            setChecklists,
            setTask
        )

        if (newChecklist) {
            setNewItemText('')
            setAddingItemToChecklist(null)
        }
    }


    function DynamicCmpPopup() {
        if (!activePopup) return null
        const Cmp = popupComponents[activePopup]
        if (!Cmp) return null

        const commonProps = {
            board,
            groupId,
            taskId,
            onClose: closePopup,
            position: popupPosition
        }

        if (activePopup === 'add') {
            commonProps.onOpen = openPopup  // needed to open the right popup from add popup
        }
        if (activePopup != 'add') {
            commonProps.onSave = savePopup
        }
        if (activePopup === 'dates') {
            commonProps.dates = dates
        }


        return <Cmp {...commonProps} />
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
                <button
                    className="modal-close-btn"
                    onClick={() => navigate(`/board/${boardId}`)}
                    aria-label="Close"
                >
                    ×
                </button>
                {task && <div className="task-details-header">
                    <h2>{task.title}</h2>
                    <div className="task-details-actions">
                        <button className="btn-add" onClick={(e) => openPopup('add', e)}>Add</button>
                        <button className="btn-labels" onClick={(e) => openPopup('labels', e)}>Labels</button>
                        <button className="btn-checklists" onClick={(e) => openPopup('checklists', e)}>Checklists</button>
                        <button className="btn-members" onClick={(e) => openPopup('members', e)}>Members</button>
                        <button className="btn-dates" onClick={(e) => openPopup('dates', e)}>Dates</button>
                    </div>
                </div>}
                <div className="task-details-content">
                    <div className="task-details-main">
                        {members.length > 0 && (
                            <div className="members">
                                <h5>Members</h5>
                                {members.map(member => (
                                    <div key={member.id}>{member.name}</div>
                                ))}
                            </div>
                        )}
                        {labels.length > 0 && (
                            <div className="labels">
                                <h5>Labels</h5>
                                <div className="labels-list">
                                    {labels.map((label, index) => (
                                        <div
                                            key={label.id || label.color || index}
                                            className="label-tag"
                                            style={{ backgroundColor: label.color }}
                                            onClick={(e) => openPopup('labels', e)}
                                        >
                                            {label.title || ' '}
                                        </div>
                                    ))}
                                    <button className="btn-add-label" onClick={(e) => openPopup('labels', e)}> + </button>
                                </div>
                            </div>
                        )}

                        {dates && (
                            <div className="dates">
                                <h5>Due date</h5>
                                <div>{new Date(dates.dateTime).toLocaleString()}</div>
                            </div>
                        )}

                        <DynamicCmpPopup />

                        <div className="description">
                            <h5>Description</h5>
                            {!descriptionEdit && (
                                <div onClick={editDescription} className="task-description-button">
                                    {description ? (
                                        <div dangerouslySetInnerHTML={{ __html: description }} />   //because of <p>description</p>
                                    ) : (
                                        <span>Add a more detailed description...</span>
                                    )}
                                </div>
                            )}
                            {descriptionEdit && (
                                <form>
                                    <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={setDescription}
                                        placeholder="Add a more detailed description..."
                                    />
                                    <button onClick={saveDescription}>Save</button>
                                    <button onClick={() => setDescriptionEdit(false)}>Cancel</button>
                                </form>
                            )}
                        </div>
                        <TaskChecklistsDisplay
                            checklists={checklists}
                            onToggleItem={toggleChecklistItem}
                            onUpdateItemText={updateItemText}
                            onUpdateChecklistName={updateChecklistName}
                            addingItemToChecklist={addingItemToChecklist}
                            newItemText={newItemText}
                            onNewItemTextChange={setNewItemText}
                            onStartAddingItem={startAddingItem}
                            onCancelAddingItem={cancelAddingItem}
                            onAddItem={handleAddItemToChecklist}
                        />
                    </div>
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
                </div>
            </div>
        </div>
    )
}