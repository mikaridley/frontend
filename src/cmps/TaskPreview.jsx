import { useNavigate } from "react-router"
import { useSelector } from "react-redux"

import doneIcon from '../assets/img/done.svg'

export function TaskPreview({ task, group, onToggleStatus }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const navigate = useNavigate()

    function openTaskDetails() {
        navigate(`/board/${board._id}/${group.id}/${task.id}`)
    }

    return (
        <section className="task-preview flex" onClick={openTaskDetails} >
            <button onClick={ev => onToggleStatus(ev, task)}>
                {task.status === 'done' &&
                    <div>
                        <img src={doneIcon} className=""/>
                    </div>}
                <div></div>
            </button>
            <p>{task.title}</p>
        </section>
    )
}