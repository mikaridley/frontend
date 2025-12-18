import { useNavigate } from "react-router"
import { useSelector } from "react-redux"

export function TaskPreview({ task, group }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const navigate = useNavigate()

    return (
        <section
            className="task-preview flex"
            onClick={() => navigate(`/board/${board._id}/${group.id}/${task.id}`)}
        >
            <p>{task.title}</p>
        </section>
    )
}