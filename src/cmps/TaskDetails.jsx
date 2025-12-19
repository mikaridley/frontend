import { taskService } from '../services/task'
import { boardService } from '../services/board'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from 'react'
import { showErrorMsg } from "../services/event-bus.service.js"
import { TaskDetailsLabels } from './taskDetailsCmps/taskDetailslabels'
import { TaskDetailsChecklist, addItemToChecklist } from './taskDetailsCmps/taskDetailschecklist'
import { TaskDetailsMembers } from './taskDetailsCmps/taskDetailsmembers'
import { TaskDetailsAdd } from './taskDetailsCmps/taskDetailsAdd'
// import '../assets/styles/cmps/TaskDetails.css'
import { TaskDetailsDates } from './taskDetailsCmps/taskDetailsDates'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// import { set } from 'react-datepicker/dist/dist/date_utils.js'


export function TaskDetails() {
    const { boardId, groupId, taskId } = useParams()
    const [task, setTask] = useState(null)
    const [board, setBoard] = useState(null)
    const [activePopup, setActivePopup] = useState(null)
    const navigate = useNavigate()
    const [description, setDescription] = useState('')
    const [descriptionEdit, setDescriptionEdit] = useState(false)
    const [comment, setComment] = useState('')
    const [commentEdit, setCommentEdit] = useState(false)
    const [members, setMembers] = useState([])
    const [labels, setLabels] = useState([])
    const [checklists, setChecklists] = useState([])
    const [dates, setDates] = useState(null)
    const [addingItemToChecklist, setAddingItemToChecklist] = useState(null)
    const [newItemText, setNewItemText] = useState('')

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

    function editComment(){
        setCommentEdit(true)
    }

    async function saveDescription(ev) {
        ev.preventDefault()
        try {
            const updatedBoard = taskService.updateTask(board, groupId, taskId, { description })
            await boardService.save(updatedBoard)
            setBoard(updatedBoard)
            setTask({ ...task, description })
            setDescriptionEdit(false)
        } catch (err) {
            console.log('Error saving description:', err)
            showErrorMsg('Cannot save description')
        }
    }

    async function saveComment(ev) {
        ev.preventDefault()
        try {
            const updatedBoard = taskService.updateTask(board, groupId, taskId, { comment })
            await boardService.save(updatedBoard)
            setBoard(updatedBoard)
            setTask({ ...task, comment })
            setCommentEdit(false)
        } catch (err) {
            console.log('Error saving description:', err)
            showErrorMsg('Cannot save description')
        }
    }


    useEffect(() => {
        loadTask()
    }, [boardId, groupId, taskId])

    async function loadTask() {
        try {
            const board = await boardService.getById(boardId)
            setBoard(board)
            const task = taskService.getTaskById(board, groupId, taskId)
            setTask(task)
            setDescription(task?.description || '')
            setComment(task?.comment || '')
            setMembers(task?.members || [])
            setLabels(task?.labels || [])
            setChecklists(task?.checklists || [])
            setDates(task?.dates || null)
        } catch (err) {
            console.log('Had issues in task details', err)
            showErrorMsg('Cannot load task')
            navigate('/board')
        }
    }

    function openPopup(popupName) {
        setActivePopup(popupName)
    }

    function closePopup() {
        setActivePopup(null)
    }

    async function savePopup(popupName, data) {
        try {
            const updatedBoard = taskService.updateTask(board, groupId, taskId, { [popupName]: data })
            await boardService.save(updatedBoard)
            setBoard(updatedBoard)
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
            const updatedBoard = taskService.updateTask(board, groupId, taskId, { checklists: updatedChecklists })
            await boardService.save(updatedBoard)
            setBoard(updatedBoard)
        } catch (err) {
            console.log('Error toggling checklist item:', err)
            showErrorMsg('Cannot update checklist')
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
        const newChecklist = await addItemToChecklist(
            checklistId, 
            newItemText, 
            checklists, 
            board, 
            groupId, 
            taskId,
            task,
            setChecklists,
            setTask,
            setBoard
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
            onClose: closePopup
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
            {task && <div>
                <h2>{task.title}</h2>
                <div className="task-details-actions">
                    <button className="btn-add" onClick={() => openPopup('add')}>Add</button>
                    <button className="btn-labels" onClick={() => openPopup('labels')}>Labels</button>
                    <button className="btn-checklists" onClick={() => openPopup('checklists')}>Checklists</button>
                    <button className="btn-members" onClick={() => openPopup('members')}>Members</button>
                    <button className="btn-dates" onClick={() => openPopup('dates')}>Dates</button>
                </div>
            </div>}
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
                            >
                                {label.title || label.name || '   '}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {dates && (
                <div className="dates">
                    <h5>Dates</h5>
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
            {checklists.length > 0 && (
                <div className="checklists">
                    <h5>Checklists</h5>
                    {checklists.map(checklist => (
                        <div key={checklist.id} className="checklist">
                            <h6>{checklist.name}</h6>
                            {checklist.items && checklist.items.map((item, index) => (
                                <div key={index} className="checklist-item">
                                    <input 
                                        type="checkbox" 
                                        checked={item.isChecked || false}
                                        onChange={() => toggleChecklistItem(checklist.id, index)}
                                    />
                                    <span>{item.text}</span>
                                </div>
                            ))}
                            
                            {addingItemToChecklist === checklist.id ? (
                                <div className="add-item-form">
                                    <input 
                                        type="text" 
                                        placeholder="Add an item"
                                        value={newItemText}
                                        onChange={(e) => setNewItemText(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddItemToChecklist(checklist.id)
                                            }
                                        }}
                                        autoFocus
                                    />
                                    <div className="add-item-buttons">
                                        <button 
                                            className="btn-add-item" 
                                            onClick={() => handleAddItemToChecklist(checklist.id)}
                                        >
                                            Add
                                        </button>
                                        <button 
                                            className="btn-cancel-item" 
                                            onClick={cancelAddingItem}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    className="btn-add-item-trigger" 
                                    onClick={() => startAddingItem(checklist.id)}
                                >
                                    Add an item
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            </div>
            <div className="comments-section">
            <h5>Comments</h5>
                {!commentEdit && (
                    <div onClick={editComment} className="task-comment-button">
                        {comment ? (
                            <div dangerouslySetInnerHTML={{ __html: comment }} />   //because of <p>comment</p>
                        ) : (
                            <span>Write a comment...</span>
                        )}
                    </div>
                )}
                {commentEdit && (
                    <form>
                        <ReactQuill 
                            theme="snow"
                            value={comment} 
                            onChange={setComment}
                            placeholder="Write a comment..."
                        />
                        <button onClick={saveComment}>Save</button>
                        <button onClick={() => setCommentEdit(false)}>Cancel</button>
                    </form>
                )}
            </div>
        </div>
    )
}