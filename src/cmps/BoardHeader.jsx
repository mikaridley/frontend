import { useState } from 'react'
import starIcon from '../assets/img/star.svg'

export function BoardHeader({ title, members, onUpdateBoard }) {
    const [titleValue, setTitleValue] = useState(title)

    function handleChange({ target }) {
        const value = target.value
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
                <button>
                    {/* <img src={starIcon} /> */}
                </button>
                <button>Share</button>
            </div>
        </header>
    )
}