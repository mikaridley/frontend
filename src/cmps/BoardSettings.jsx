import closeIcon from '../assets/img/close.svg'
import shareIcon from '../assets/img/share.svg'
import starIcon from '../assets/img/star.svg'
import yellowStarIcon from '../assets/img/yellow-star.png'
import labelIcon from '../assets/img/label.svg'
import activityIcon from '../assets/img/activity.svg'
import archiveIcon from '../assets/img/archive.svg'
import closeBoardIcon from '../assets/img/close-board.svg'
import { useState } from 'react'
import { PhotosBackground } from './addBoardCmps/PhotosBackground'

export function BoardSettings({
  board,
  openHeaderMenu,
  onTogleStar,
  isStarred,
  onRemoveBoard,
}) {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isChangeBackgroundOpen, setIsChangeBackgroundOpen] = useState(false)

  function onToggleRemoveModal() {
    setIsRemoveModalOpen(isRemoveModalOpen => !isRemoveModalOpen)
  }

  function removeBoard() {
    onRemoveBoard(board._id)
  }

  function openChangeBackground() {
    setIsChangeBackgroundOpen(isChangeBackgroundOpen => !isChangeBackgroundOpen)
  }

  const { kind, color } = board.style.background
  const bgStyle = kind === 'solid' ? 'backgroundColor' : 'background'
  return (
    <section className="board-settings">
      <header className="board-settings-header">
        <h2>Menu</h2>
        <img onClick={openHeaderMenu} src={closeIcon} />
      </header>

      <div className="menu-item">
        <img src={shareIcon} />
        <button>share</button>
      </div>

      <div className="board-settings-users">
        <div className="board-settings-user"></div>
      </div>

      <div onClick={onTogleStar} className="menu-item">
        {/* <img src={starIcon} /> */}
        {isStarred ? <img src={yellowStarIcon} /> : <img src={starIcon} />}
        <button>star</button>
      </div>

      <div className="setting-change-background">
        <div className="menu-item">
          <div
            style={
              kind === 'photo'
                ? { backgroundImage: `url(${color})` }
                : { [bgStyle]: color }
            }
            className="board-settings-bg-icon"
          ></div>
          <button onClick={openChangeBackground}>Change background</button>
        </div>
        {/* {isChangeBackgroundOpen && <PhotosBackground />} */}
      </div>

      <div className="menu-item">
        <img src={labelIcon} />
        <button>Labels</button>
      </div>

      <div className="menu-item">
        <img src={activityIcon} />
        <button>Activity</button>
      </div>

      <div className="menu-item">
        <img src={archiveIcon} />
        <button>Archived items</button>
      </div>

      <div className="settings-close-board">
        <div onClick={onToggleRemoveModal} className="menu-item">
          <img src={closeBoardIcon} />
          <button>Close board</button>
        </div>

        {isRemoveModalOpen && (
          <div className="are-you-sure-close-board">
            <header>
              <h3>Close board?</h3>
              <img onClick={onToggleRemoveModal} src={closeIcon} />
            </header>
            <button onClick={removeBoard}>Close</button>
          </div>
        )}
      </div>
    </section>
  )
}
