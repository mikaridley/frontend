import { useState } from 'react'

import starIcon from '../assets/img/star.svg'
import yellowStarIcon from '../assets/img/yellow-star.png'
import moreIcon from '../assets/img/more.svg'
import { BoardSettings } from './BoardSettings'

export function BoardHeader({
  board,
  onUpdateBoard,
  starToggle,
  onRemoveBoard,
}) {
  const { title, members } = board
  const [titleValue, setTitleValue] = useState(title)
  const [isStarred, setIsStarred] = useState(board.isStarred)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function onTogleStar() {
    setIsStarred(isStarred => !isStarred)
    starToggle()
  }

  function handleChange({ target }) {
    const value = target.value
    setTitleValue(value)
  }

  function openHeaderMenu() {
    setIsMenuOpen(isMenuOpen => !isMenuOpen)
  }

  return (
    <header className="board-header flex space-between align-center">
      <input
        className="title-input"
        onChange={handleChange}
        onBlur={() => onUpdateBoard(titleValue)}
        value={titleValue}
      />
      <div className="header-btns flex">
        <button className="header-star" onClick={onTogleStar}>
          {isStarred ? <img src={yellowStarIcon} /> : <img src={starIcon} />}
        </button>
        <button>Share</button>
        <button className="header-more-icon" onClick={openHeaderMenu}>
          <img src={moreIcon} />
        </button>
      </div>
      {isMenuOpen && (
        <BoardSettings
          board={board}
          openHeaderMenu={openHeaderMenu}
          onTogleStar={onTogleStar}
          isStarred={isStarred}
          onRemoveBoard={onRemoveBoard}
        />
      )}
    </header>
  )
}
