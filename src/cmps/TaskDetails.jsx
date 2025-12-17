import { taskService } from '../services/task'
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from 'react'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"


export function TaskDetails() {
    const { boardId, groupId, taskId } = useParams()
    const [task, setTask] = useState(null)

    useEffect(() => {
        taskService.getTask(boardId, groupId, taskId).then(setTask)
    }, [boardId, groupId, taskId])

    return (
        <div>
            <h1>Task Details</h1>
        </div>
    )
}