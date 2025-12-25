import { useState } from 'react'

import { BoardSettings } from './BoardSettings'
import starIcon from '../assets/img/star.svg'
import yellowStarIcon from '../assets/img/yellow-star.png'
import moreIcon from '../assets/img/more.svg'
import { ShareBoard } from './ShareBoard'

export function BoardHeader({ board, onUpdateBoard, starToggle, onRemoveBoard, changeBoardColor }) {
  const [boardToEdit, setBoardToEdit] = useState(board)
  const [isStarred, setIsStarred] = useState(board.isStarred)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  function handleChange({ target }) {
    const value = target.value
    setBoardToEdit(board => ({ ...board, title: value }))
  }

  function onTogleStar() {
    setIsStarred(isStarred => !isStarred)
    starToggle()
  }

  function openHeaderMenu() {
    setIsMenuOpen(isMenuOpen => !isMenuOpen)
  }

  function onToggleShare() {
    setIsShareOpen(isShareOpen => !isShareOpen)
  }

  return (
    <header className="board-header board-details-layout space-between align-center">
      <input
        className="title-input"
        onChange={handleChange}
        onBlur={() => onUpdateBoard(boardToEdit)}
        value={boardToEdit.title || ''}
      />
      <div className="header-btns flex">
        <button className="header-star" onClick={onTogleStar}>
          {isStarred ? <img src={yellowStarIcon} /> : <img src={starIcon} />}
        </button>
        <button onClick={onToggleShare}>Share</button>
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
          changeBoardColor={changeBoardColor}
        />
      )}
      {isShareOpen &&
        <ShareBoard onToggleShare={onToggleShare} onUpdateBoard={onUpdateBoard} />
      }
    </header>
  )
}
