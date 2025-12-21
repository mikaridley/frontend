import closeIcon from '../assets/img/close.svg'
import shareIcon from '../assets/img/share.svg'
import starIcon from '../assets/img/star.svg'
import yellowStarIcon from '../assets/img/yellow-star.png'
import labelIcon from '../assets/img/label.svg'
import activityIcon from '../assets/img/activity.svg'
import archiveIcon from '../assets/img/archive.svg'
import closeBoardIcon from '../assets/img/close-board.svg'

export function BoardSettings({
  board,
  openHeaderMenu,
  onTogleStar,
  isStarred,
  onRemoveBoard,
}) {
  console.log(board)
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

      <div className="menu-item">
        <div
          style={
            kind === 'photo'
              ? { backgroundImage: `url(${color})` }
              : { [bgStyle]: color }
          }
          className="board-settings-bg-icon"
        ></div>
        <button>Change background</button>
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

      <div onClick={() => onRemoveBoard(board._id)} className="menu-item">
        <img src={closeBoardIcon} />
        <button>Close board</button>
      </div>
    </section>
  )
}
