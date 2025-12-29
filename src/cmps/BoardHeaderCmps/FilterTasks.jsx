import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import closeIcon from '../../assets/img/close.svg'

export function FilterTasks({ onSetFilterBy, filterBy, onToggleFilter }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const [filterToEdit, setFilterToEdit] = useState({ ...filterBy })

    useEffect(() => onSetFilterBy(filterToEdit), [filterToEdit])

    function handleTxtChange({ target }) {
        const value = target.value
        setFilterToEdit(prevFilter => ({ ...prevFilter, txt: value }))
    }

    function handleCheckboxChange({ target }) {
        const value = target.value
        const field = target.name

        if (target.checked) {
            setFilterToEdit(prevFilter =>
                ({ ...prevFilter, [field]: [...prevFilter[field], value] })
            )
        } else {
            setFilterToEdit(prevFilter =>
                ({ ...prevFilter, [field]: prevFilter[field].filter(res => res !== value) })
            )
        }
    }

    function handleRadioChange({ target }) {
        const value = target.value
        console.log('target:', target)
        if (value === filterToEdit.status) {
            setFilterToEdit(prevFilter => ({ ...prevFilter, status: '' }))
        } else {
            setFilterToEdit(prevFilter => ({ ...prevFilter, status: value }))
        }
    }

    const { txt, members, status, dueDate, labels } = filterToEdit

    return (
        <section className="filter-tasks">
            <header className="filter-header grid">
                <h1>Filter</h1>
                <button onClick={onToggleFilter}>
                    <img src={closeIcon} />
                </button>
            </header>

            <section className="filter-lists">
                <h2>Keyword</h2>
                <input
                    type="text"
                    placeholder="Enter a keyword..."
                    name="txt"
                    onChange={handleTxtChange}
                    value={txt}
                />

                <h2>Members</h2>
                <ul className="filter-members">
                    <li key={0}>
                        <input
                            type="checkbox"
                            id="noMember"
                            name="members"
                            value='none'
                            onChange={handleCheckboxChange}
                            checked={members.includes('none')}
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
                                onChange={handleCheckboxChange}
                                checked={members.includes(member._id)}
                            />
                            <label htmlFor={member._id}>{member.fullname}</label>
                        </li>
                    )}
                </ul>

                <h2>Card status</h2>
                <ul className="status-filter">
                    <li key={1}>
                        <input
                            type="checkbox"
                            id="done"
                            name="status"
                            value="done"
                            onChange={handleRadioChange}
                            checked={status === 'done'}
                        />
                        <label htmlFor="done">Marked as complete</label>
                    </li>
                    <li key={2}>
                        <input
                            type="checkbox"
                            id="inProgress"
                            name="status"
                            value="inProgress"
                            onChange={handleRadioChange}
                            checked={status === 'inProgress'}
                        />
                        <label htmlFor="inProgress">Not marked as complete</label>
                    </li>
                </ul>

                <h2>Due dates</h2>
                <ul className="dates-filter">
                    <li key={0}>
                        <input
                            type="checkbox"
                            id="noDates"
                            name="dueDate"
                            value='none'
                            onChange={handleCheckboxChange}
                            checked={dueDate.includes('none')}
                        />
                        <label htmlFor="noDates">No dates</label>
                    </li>
                    <li key={1}>
                        <input
                            type="checkbox"
                            id="overdue"
                            name="dueDate"
                            value="overdue"
                            onChange={handleCheckboxChange}
                            checked={dueDate.includes('overdue')}
                        />
                        <label htmlFor="overdue">Overdue</label>
                    </li>
                    <li key={2}>
                        <input
                            type="checkbox"
                            id="today"
                            name="dueDate"
                            value="today"
                            onChange={handleCheckboxChange}
                            checked={dueDate.includes('today')}
                        />
                        <label htmlFor="today">Due in the next day</label>
                    </li>
                </ul>

                <h2>Labels</h2>
                <ul className="labels-filter">
                    <li key={0}>
                        <input
                            type="checkbox"
                            id="noLabels"
                            name="labels"
                            value={'none'}
                            onChange={handleCheckboxChange}
                            checked={labels.includes('none')}
                        />
                        <label htmlFor="noLabels">No labels</label>
                    </li>
                    {board.labels.map(label =>
                        <li key={label.id}>
                            <input
                                type="checkbox"
                                id={label.id}
                                name="labels"
                                value={label.id}
                                onChange={handleCheckboxChange}
                                checked={labels.includes(label.id)}
                            />
                            <label htmlFor={label.id}
                                style={
                                    {
                                        backgroundColor: label.color,
                                        color: `color-mix(in srgb, ${label.color}, white 70%)`
                                    }
                                }>
                                {label.title}
                            </label>
                        </li>
                    )}
                </ul>
            </section>

        </section>
    )
}