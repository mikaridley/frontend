import { useEffect, useState } from 'react'

import { ShareBoard } from './ShareBoard'
import { BoardSettings } from './BoardSettings'

import starIcon from '../../assets/img/star-white.svg'
import yellowStarIcon from '../../assets/img/yellow-star.png'
import moreIcon from '../../assets/img/more-white.svg'
import filterIcon from '../../assets/img/filter.svg'
import { FilterTasks } from './FilterTasks'
import { preconnect } from 'react-dom'

export function BoardHeader({
  board,
  onUpdateBoard,
  onRemoveBoard,
  changeBoardColor,
  onSetFilterBy,
  filterBy
}) {
  const [boardToEdit, setBoardToEdit] = useState(board)
  const [isStarred, setIsStarred] = useState(board.isStarred)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    setBoardToEdit(board)
  }, [board])

  function handleChange({ target }) {
    const value = target.value
    setBoardToEdit(prevBoard => ({ ...prevBoard, title: value }))
  }

  function onToggleStar() {
    setIsStarred(isStarred => !isStarred)
    const updatedBoard = { ...board, isStarred: !board.isStarred }
    onUpdateBoard(updatedBoard)
  }

  function onUpdateBoardTitle() {
    const { title } = boardToEdit
    if (!title || board.title === title || !title.trim().length) {
      return setBoardToEdit(prevBoard => ({ ...prevBoard, title: board.title }))
    }
    onUpdateBoard(boardToEdit)
  }

  function openHeaderMenu() {
    setIsMenuOpen(isMenuOpen => !isMenuOpen)
  }

  function onToggleShare() {
    setIsShareOpen(isShareOpen => !isShareOpen)
  }

  function onToggleFilter() {
    setIsFilterOpen(isFilterOpen => !isFilterOpen)
  }

  return (
    <header className="board-header board-details-layout align-center space-between">
      <input
        className="title-input"
        onChange={handleChange}
        onBlur={onUpdateBoardTitle}
        value={boardToEdit.title || ''}
      />
      <section className="header-btns flex align-center">
        <ul className="members flex">
          {board.members.map((member, idx) =>
            <li key={member._id}>
              {member.imgUrl && <img src={member.imgUrl} style={{ left: `${5 * idx}px` }} />}
            </li>
          )}
        </ul>

        <button className='filter-btn' onClick={onToggleFilter}>
          <img src={filterIcon} />
        </button>
        {isFilterOpen &&
          <FilterTasks
            onSetFilterBy={onSetFilterBy}
            filterBy={filterBy}
            onToggleFilter={onToggleFilter}
          />
        }

        <button className="header-star" onClick={onToggleStar}>
          {isStarred ? <img src={yellowStarIcon} /> : <img src={starIcon} />}
        </button>

        <button className="share-btn" onClick={onToggleShare}>Share</button>
        {isShareOpen &&
          <ShareBoard onToggleShare={onToggleShare} onUpdateBoard={onUpdateBoard} />
        }

        <button className="header-more-icon" onClick={openHeaderMenu}>
          <img src={moreIcon} />
        </button>
        {isMenuOpen && (
          <BoardSettings
            board={board}
            openHeaderMenu={openHeaderMenu}
            onTogleStar={onToggleStar}
            isStarred={isStarred}
            onRemoveBoard={onRemoveBoard}
            changeBoardColor={changeBoardColor}
            onToggleShare={onToggleShare}
          />
        )}
      </section>
    </header>
  )
}
