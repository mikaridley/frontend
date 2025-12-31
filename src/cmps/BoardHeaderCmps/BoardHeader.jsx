import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { BoardSettings } from './BoardSettings'
import { ShareBoard } from './ShareBoard'
import { FilterTasks } from './FilterTasks'
import { LightTooltip } from '../LightToolTip'

import starIcon from '../../assets/img/star-white.svg'
import yellowStarIcon from '../../assets/img/yellow-star.png'
import moreIcon from '../../assets/img/more-white.svg'
import filterIcon from '../../assets/img/filter.svg'
import clearFilterIcon from '../../assets/img/clear-filter.svg'

export function BoardHeader({
  board,
  onUpdateBoard,
  onRemoveBoard,
  changeBoardColor,
  filterBy,
  onSetFilterBy,
  onClearFilter,
}) {
  const [boardToEdit, setBoardToEdit] = useState(board)
  const [isStarred, setIsStarred] = useState(board.isStarred)
  const [searchParams] = useSearchParams()

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

  const isFilteredBoard = searchParams.size > 0

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
              <LightTooltip title={member.fullname}>
                {member.imgUrl && <img src={member.imgUrl} style={{ left: `${5 * idx}px` }} />}
              </LightTooltip>
            </li>
          )}
        </ul>

        <button className='filter-btn' onClick={onToggleFilter}>
          <LightTooltip title="Filter tasks">
            <img src={filterIcon} />
          </LightTooltip>
        </button>
        {isFilteredBoard &&
          <button className='clear-filter-btn' onClick={onClearFilter}>
            <LightTooltip title="Clear filter">
              <img src={clearFilterIcon} />
            </LightTooltip>
          </button>
        }
        {isFilterOpen &&
          <FilterTasks
            onSetFilterBy={onSetFilterBy}
            filterBy={filterBy}
            onToggleFilter={onToggleFilter}
          />
        }

        <button className="header-star" onClick={onToggleStar}>
          <LightTooltip title="Star board">
            {isStarred ? <img src={yellowStarIcon} /> : <img src={starIcon} />}
          </LightTooltip>
        </button>

        <button className="share-btn" onClick={onToggleShare}>Share</button>
        {isShareOpen &&
          <ShareBoard onToggleShare={onToggleShare} onUpdateBoard={onUpdateBoard} />
        }

        <button className="header-more-icon" onClick={openHeaderMenu}>
          <LightTooltip title="Open menu">
            <img src={moreIcon} />
          </LightTooltip>
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
    </header >
  )
}
