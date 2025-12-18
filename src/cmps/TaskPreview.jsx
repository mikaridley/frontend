import { Link } from "react-router-dom";

export function TaskPreview({ task }) {
    return (
            <section className="task-preview flex">
                <p>{task.title}</p>
            </section>
    )
}