import { taskService } from '../services/task'
import { boardService } from '../services/board'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from 'react'
import { showErrorMsg } from "../services/event-bus.service.js"
import { TaskDetailsLabels } from './taskDetailsCmps/taskDetailslabels'
import { TaskDetailsChecklist } from './taskDetailsCmps/taskDetailschecklist'
import { TaskDetailsMembers } from './taskDetailsCmps/taskDetailsmembers'
import { TaskDetailsAdd } from './taskDetailsCmps/taskDetailsAdd'
import '../assets/styles/cmps/TaskDetails.css'
import { TaskDetailsDates } from './taskDetailsCmps/taskDetailsDates'

export function TaskDetails() {
    const { boardId, groupId, taskId } = useParams()
    const [task, setTask] = useState(null)
    const [board, setBoard] = useState(null)
    const [activePopup, setActivePopup] = useState(null)
    const navigate = useNavigate()
    const [description, setDescription] = useState('')
    const [descriptionEdit, setDescriptionEdit] = useState(false)

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

    function saveDescription() {
        setDescriptionEdit(false)
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

    function savePopup(popupName, data) {
        setTask({ ...task, [popupName]: data })
        console.log(task)
        closePopup()
    }

    function DynamicCmp() {
        if (!activePopup) return null
        const Cmp = popupComponents[activePopup]
        if (!Cmp) return null

        const commonProps = {
            board,
            groupId,
            taskId,
            onClose: closePopup
        }

        // Add onOpen prop for components that need it
        if (activePopup === 'add') {
            commonProps.onOpen = openPopup
        }
        if (activePopup != 'add') {
            commonProps.onSave = savePopup
        }
        

        return <Cmp {...commonProps} />
    }

    return (
        <div className="task-details">
            {task && <div>
                <h2>{task.title}</h2>
                <div className="task-details-actions">
                    <button className="btn-add" onClick={() => openPopup('add')}>Add</button>
                    <button className="btn-labels" onClick={() => openPopup('labels')}>Labels</button>
                    <button className="btn-checklists" onClick={() => openPopup('checklists')}>Checklists</button>
                    <button className="btn-members" onClick={() => openPopup('members')}>Members</button>
                </div>
            </div>}

            <DynamicCmp />
            
            <div className="description">
                {!descriptionEdit && (
                    <button onClick={editDescription} className="description-button">
                        {description || 'Add a more detailed description...'}
                    </button>
                )}
                {descriptionEdit && (
                    <form>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a more detailed description..."
                        />
                        <button onClick={saveDescription}>Save</button>
                    </form>
                )}
            </div>
        </div>
    )
}