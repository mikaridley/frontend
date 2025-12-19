import { useState } from 'react'
import starIcon from '../assets/img/star.svg'
import yellowStarIcon from '../assets/img/yellow-star.png'

export function BoardHeader({ board, onUpdateBoard, starToggle }) {
    const { title, members } = board
    const [titleValue, setTitleValue] = useState(title)
    const [isStarred, setIsStarred] = useState(board.isStarred)

    function onTogleStar() {
        setIsStarred(isStarred => !isStarred)
        starToggle()
    }

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
                <button onClick={onTogleStar}>
                    {isStarred ?
                        <img src={yellowStarIcon} />
                        : <img src={starIcon} />
                    }
                </button>
                <button>Share</button>
            </div>
        </header>
    )
}