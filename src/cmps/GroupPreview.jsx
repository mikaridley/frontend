import { TaskList } from './TaskList'

export function GroupPreview({ group }) {
    return (
        <section className="group-preview">
            <button>
                <h2>{group.title}</h2>
            </button>
            <TaskList tasks={group.tasks} />
        </section>
    )
}