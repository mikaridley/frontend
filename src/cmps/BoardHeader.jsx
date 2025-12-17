export function BoardHeader({ title, members, handleChande, onUpdateBoard }) {
    return (
        <header className="board-header flex space-between align-center">
            <input onChange={handleChande} onBlur={onUpdateBoard} value={title}></input>
            <div className="header-btns">
                <button>star</button>
                <button>Share</button>
            </div>
        </header>
    )
}