import { useState } from "react"
import { useSelector } from "react-redux"

export function FilterTasks({ onSetFilterBy, filterBy }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const [filterToEdit, setFilterToEdit] = useState({ ...filterBy })

    function handleTxtChange({ target }) {
        const value = target.value
        setFilterToEdit(prevFilter => ({ ...prevFilter, txt: value }))
    }

    console.log('filterBy:', filterToEdit)

    function handleChange({ target }) {
        const value = target.value
        const field = target.name

        if (target.checked) {
            setFilterToEdit(prevFilter =>
                ({ ...prevFilter, [field]: [...prevFilter[field], value] })
            )
        }

        console.log('value:', value)
        console.log('target.checked:', target.checked)

    }

    const { txt } = filterToEdit

    return (
        <section className="filter-tasks">
            <h1>keyword</h1>
            <input
                type="text"
                placeholder="Enter a keyword..."
                name="txt"
                onChange={handleTxtChange}
                value={txt}
            />
            <p>Search cards, members, labels, and more.</p>

            <h2>Members</h2>
            <ul className="filter-members">
                <li>
                    <input
                        type="checkbox"
                        id="noMember"
                        name="members"
                        value=""
                        onChange={handleChange}
                    />
                    <label htmlFor="noMember">No members</label>
                </li>
                {board.members.map(member =>
                    <li key={member._id}>
                        <input
                            type="checkbox"
                            id={member._id}
                            name="members"
                            value={member._id}
                            onChange={handleChange}
                        />
                        <label htmlFor={member._id}>{member.fullname}</label>
                    </li>
                )}
            </ul>

            <h2>Card status</h2>
            <li>
                <input
                    type="checkbox"
                    id="complete"
                    name="status"
                    value="done"
                    onChange={handleChange}
                />
                <label htmlFor="complete">Marked as complete</label>
            </li>
            <li>
                <input
                    type="checkbox"
                    id="uncomplete"
                    name="status"
                    value="inProgress"
                    onChange={handleChange}
                />
                <label htmlFor="uncomplete">Not marked as complete</label>
            </li>

            <h2>Due dates</h2>
            <li>
                <input
                    type="checkbox"
                    id="noDates"
                    name="dates"
                    value=""
                    onChange={handleChange}
                />
                <label htmlFor="noDates">No dates</label>
            </li>
            <li>
                <input
                    type="checkbox"
                    id="overdue"
                    name="dates"
                    value="overdue"
                    onChange={handleChange}
                />
                <label htmlFor="overdue">Overdue</label>
            </li>
            <li>
                <input
                    type="checkbox"
                    id="today"
                    name="dates"
                    value="today"
                    onChange={handleChange}
                />
                <label htmlFor="today">Due in the next day</label>
            </li>

            <h2>Labels</h2>
            <li>
                <input
                    type="checkbox"
                    id="noLabels"
                    name="labels"
                    value=""
                    onChange={handleChange}
                />
                <label htmlFor="noLabels">No labels</label>
            </li>
            {board.labels.map(label =>
                <li key={label.id} style={{ backgroundColor: label.color }}>
                    <input
                        type="checkbox"
                        id={label.id}
                        name="labels"
                        value={label.id}
                        onChange={handleChange}
                    />
                    <label htmlFor={label.id}>{label.title}</label>
                </li>
            )}

            {/* <h2>Activity</h2> */}
        </section>
    )
}