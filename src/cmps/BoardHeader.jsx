export function BoardHeader({ title, members, handleChange, onUpdateBoard }) {
    return (
        <header className="board-header flex space-between align-center">
            <input className="title-input" onChange={handleChange} onBlur={onUpdateBoard} value={title}></input>
            <div className="header-btns">
                <button>star</button>
                <button>Share</button>
            </div>
        </header>
    )
}