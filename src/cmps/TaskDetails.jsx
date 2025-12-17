import { taskService } from '../services/task'
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from 'react'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"


export function TaskDetails() {
    const { boardId, groupId, taskId } = useParams()
    const [task, setTask] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        taskService.getTaskById(board, groupId, taskId).then(setTask)
    }, [boardId, groupId, taskId])


    async function loadTask() {
        try {
            const task = await taskService.getTaskById(board, groupId, taskId)
            setTask(task)
        } catch (err) {
            console.log('Had issues in task details', err)
            showErrorMsg('Cannot load task')
            navigate('/board')
        }
    }

    return (
        <div>
            <h1>Task Details</h1>
        </div>
    )
}