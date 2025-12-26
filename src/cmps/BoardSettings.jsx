import closeIcon from '../assets/img/close.svg'
import shareIcon from '../assets/img/share.svg'
import starIcon from '../assets/img/star.svg'
import yellowStarIcon from '../assets/img/yellow-star.png'
import labelIcon from '../assets/img/label.svg'
import activityIcon from '../assets/img/activity.svg'
import archiveIcon from '../assets/img/archive.svg'
import closeBoardIcon from '../assets/img/close-board.svg'
import { useEffect, useState } from 'react'
import { PhotosBackground } from './addBoardCmps/PhotosBackground'
import { useSelector } from 'react-redux'
import { SetBackgroundHeader } from './addBoardCmps/SetBackgroundHeader'
import photosImg from '../assets/img/photos.jpg'
import colorsImg from '../assets/img/colors.png'
import { ColorsBackground } from './addBoardCmps/ColorsBackground'
import { getColorsBg, getPhotos } from '../store/actions/board.actions'
import { MemberDefaultPhoto } from './MemberDefaultPhoto'

export function BoardSettings({
  board,
  openHeaderMenu,
  onTogleStar,
  isStarred,
  onRemoveBoard,
  changeBoardColor,
}) {
  if (!board.style)
    board.style = { background: { kind: 'solid', color: '#0079bf' } }
  if (!board.style.background)
    board.style.background = { kind: 'solid', color: '#0079bf' }

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isChangeBackgroundOpen, setIsChangeBackgroundOpen] = useState({
    isOpen: false,
    openKind: '',
  })
  const [selectedColor, setSelectedColor] = useState(board.style.background)
  const photosBg = useSelector(
    storeState => storeState.boardModule.backgroundPhotos
  )
  const backgrounds = getColorsBg()
  const loggedinUser = useSelector(
    storeState => storeState.userModule.loggedinUser
  )
  console.log(board)
  useEffect(() => {
    _getPhotos()
  }, [])

  async function _getPhotos() {
    try {
      await getPhotos()
    } catch (err) {
      console.error('Failed to load backgrounds', err)
    }
  }

  function onToggleRemoveModal() {
    setIsRemoveModalOpen(isRemoveModalOpen => !isRemoveModalOpen)
  }

  function removeBoard() {
    onRemoveBoard(board._id)
  }

  function toggleChangeBackground() {
    setIsChangeBackgroundOpen({
      ...isChangeBackgroundOpen,
      isOpen: !isChangeBackgroundOpen.isOpen,
    })
  }

  function setOpenKind(openTo) {
    setIsChangeBackgroundOpen({
      ...isChangeBackgroundOpen,
      openKind: openTo,
    })
  }

  function onChangeBackground(color, kind) {
    setSelectedColor({ color, kind })
    changeBoardColor({ color, kind })
  }

  const { kind, color } = board.style.background
  const bgStyle = kind === 'solid' ? 'backgroundColor' : 'background'
  return (
    <section className="board-settings">
      {!isChangeBackgroundOpen.isOpen ? (
        <>
          <header className="board-settings-header">
            <h2>Menu</h2>
            <img onClick={openHeaderMenu} src={closeIcon} />
          </header>

          <div className="menu-item">
            <img src={shareIcon} />
            <button>share</button>
            <section className="setting-members">
              {board.members.map(member => {
                return (
                  <div key={member.id} className="member-photo">
                    {loggedinUser ? (
                      <img src={loggedinUser.imgUrl} />
                    ) : (
                      <MemberDefaultPhoto
                        size={25}
                        memberName={member.fullname}
                      />
                    )}
                  </div>
                )
              })}
            </section>
          </div>

          <div className="board-settings-users">
            <div className="board-settings-user"></div>
          </div>

          <div onClick={onTogleStar} className="menu-item">
            {isStarred ? <img src={yellowStarIcon} /> : <img src={starIcon} />}
            <button>star</button>
          </div>

          <div className="setting-change-background">
            <div onClick={toggleChangeBackground} className="menu-item">
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
        </>
      ) : (
        <div className="board-settings-bg-options">
          {isChangeBackgroundOpen.openKind === '' && (
            <section className="board-settings-bg-all">
              <SetBackgroundHeader
                onBack={toggleChangeBackground}
                onClose={toggleChangeBackground}
                header={'Change background'}
              />
              <div
                className="card-preview"
                onClick={() => setOpenKind('photos')}
              >
                <img src={photosImg} />
                <h3>Photos</h3>
              </div>
              <div
                className="card-preview"
                onClick={() => setOpenKind('colors')}
              >
                <img src={colorsImg} />
                <h3>Colors</h3>
              </div>
            </section>
          )}
          {isChangeBackgroundOpen.openKind === 'photos' && (
            <PhotosBackground
              photosBg={photosBg}
              onClose={toggleChangeBackground}
              goBack={() => setOpenKind('')}
              selectedColor={selectedColor}
              onChangeBackground={onChangeBackground}
            />
          )}
          {isChangeBackgroundOpen.openKind === 'colors' && (
            <ColorsBackground
              backgrounds={backgrounds}
              onClose={toggleChangeBackground}
              onBack={() => setOpenKind('')}
              selectedColor={selectedColor}
              onChangeBackground={onChangeBackground}
            />
          )}
        </div>
      )}
    </section>
  )
}
