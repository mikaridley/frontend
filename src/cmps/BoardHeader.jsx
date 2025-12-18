import { useState } from "react"

export function BoardHeader({ title, members, onUpdateBoard }) {
    const [titleValue, setTitleValue] = useState(title)

    function handleChange({ target }) {
        let value = target.value
        setTitleValue(value)
    }

    return (
        <header className="board-header flex space-between align-center">
            <input
                className="title-input"
                onChange={handleChange}
                onBlur={() => onUpdateBoard(titleValue)}
                value={titleValue} />
            <div className="header-btns">
                <button>star</button>
                <button>Share</button>
            </div>
        </header>
    )
}