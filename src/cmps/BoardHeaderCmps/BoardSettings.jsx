import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { ColorsBackground } from '../addBoardCmps/ColorsBackground'
import { PopUpHeader } from '../addBoardCmps/PopUpHeader'
import { SettingsArchive } from './SettingsArchive'
import { PhotosBackground } from '../../cmps/addBoardCmps/PhotosBackground'
import { TaskDetailsLabels } from '../taskDetailsCmps/popups/taskDetailslabels'
import { CloseCheckModal } from './CloseCheckModal'
import { Activities } from './Activities'

import { getColorsBg, getPhotos } from '../../store/actions/board.actions'

import closeIcon from '../../assets/img/close.svg'
import shareIcon from '../../assets/img/share.svg'
import starIcon from '../../assets/img/star.svg'
import yellowStarIcon from '../../assets/img/yellow-star.png'
import labelIcon from '../../assets/img/label.svg'
import activityIcon from '../../assets/img/activity.svg'
import archiveIcon from '../../assets/img/archive.svg'
import closeBoardIcon from '../../assets/img/close-board.svg'
import photosImg from '../../assets/img/photos.jpg'
import colorsImg from '../../assets/img/colors.png'

export function BoardSettings({
  board,
  openHeaderMenu,
  onTogleStar,
  isStarred,
  onRemoveBoard,
  changeBoardColor,
  onToggleShare,
}) {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isChangeBackgroundOpen, setIsChangeBackgroundOpen] = useState({
    isOpen: false,
    openTo: '',
  })
  const [isArchiveOpen, setIsArchiveOpen] = useState({
    isOpen: false,
    openTo: 'cards',
  })
  const [isActivityOpen, setIsActivityOpen] = useState({
    isOpen: false,
    openTo: '',
  })
  const [isLabelsOpen, setIsLabelsOpen] = useState({
    isOpen: false,
    openTo: '',
  })
  const [selectedColor, setSelectedColor] = useState(board.style.background)
  const photosBg = useSelector(
    storeState => storeState.boardModule.backgroundPhotos
  )
  const backgrounds = getColorsBg()
  const settingsRef = useRef(null)

  useEffect(() => {
    _getPhotos()
  }, [])

  useEffect(() => {
    function handleClickOutside(ev) {
      if (!settingsRef.current?.contains(ev.target)) {
        openHeaderMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
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

  function toggleLabels() {
    setIsLabelsOpen({
      ...isLabelsOpen,
      isOpen: !isLabelsOpen.isOpen,
    })
  }

  function toggleActivity() {
    setIsActivityOpen({
      ...isActivityOpen,
      isOpen: !isActivityOpen.isOpen,
    })
  }

  function toggleArchive() {
    setIsArchiveOpen({
      ...isArchiveOpen,
      isOpen: !isArchiveOpen.isOpen,
    })
  }

  function setBgopenTo(openTo) {
    setIsChangeBackgroundOpen({
      ...isChangeBackgroundOpen,
      openTo: openTo,
    })
  }

  function onChangeBackground(color, kind) {
    setSelectedColor({ color, kind })
    changeBoardColor({ color, kind })
  }

  const { kind, color } = board.style.background
  const bgStyle = kind === 'solid' ? 'backgroundColor' : 'background'
  return (
    <section className="board-settings" ref={settingsRef}>
      {!isChangeBackgroundOpen.isOpen && !isArchiveOpen.isOpen && !isLabelsOpen.isOpen && !isActivityOpen.isOpen && (
        <>
          <header className="board-settings-header">
            <h2>Menu</h2>
            <img onClick={openHeaderMenu} src={closeIcon} />
          </header>

          <div className="menu-item">
            <img src={shareIcon} />
            <button
              onClick={() => {
                onToggleShare()
                openHeaderMenu()
              }}
            >
              share
            </button>

            <section className="setting-members">
              {board.members.map(member => (
                <div className="member-photo" key={member._id}>
                  {member.imgUrl && <img src={member.imgUrl} />}
                </div>
              ))}
            </section>
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

          <div onClick={toggleLabels} className="menu-item">
            <img src={labelIcon} />
            <button>Labels</button>
          </div>

          <div onClick={toggleActivity} className="menu-item">
            <img src={activityIcon} />
            <button>Activity</button>
          </div>

          <div className="menu-item" onClick={toggleArchive}>
            <img src={archiveIcon} />
            <button>Archived items</button>
          </div>

          <div className="settings-close-board">
            <div onClick={onToggleRemoveModal} className="menu-item">
              <img src={closeBoardIcon} />
              <button>Close board</button>
            </div>

            {isRemoveModalOpen && (
              <CloseCheckModal
                onRemove={removeBoard}
                onCloseModal={onToggleRemoveModal}
                text={'Close board?'}
                buttonText={'Close'}
              />
            )}
          </div>
        </>
      )}
      {isChangeBackgroundOpen.isOpen && (
        <div className="board-settings-bg-options">
          {isChangeBackgroundOpen.openTo === '' && (
            <section className="board-settings-bg-all">
              <PopUpHeader
                onBack={toggleChangeBackground}
                onClose={openHeaderMenu}
                header={'Change background'}
              />
              <div
                className="card-preview"
                onClick={() => setBgopenTo('photos')}
              >
                <img src={photosImg} />
                <h3>Photos</h3>
              </div>
              <div
                className="card-preview"
                onClick={() => setBgopenTo('colors')}
              >
                <img src={colorsImg} />
                <h3>Colors</h3>
              </div>
            </section>
          )}
          {isChangeBackgroundOpen.openTo === 'photos' && (
            <PhotosBackground
              photosBg={photosBg}
              onClose={openHeaderMenu}
              goBack={() => setBgopenTo('')}
              selectedColor={selectedColor}
              onChangeBackground={onChangeBackground}
            />
          )}
          {isChangeBackgroundOpen.openTo === 'colors' && (
            <ColorsBackground
              backgrounds={backgrounds}
              onClose={openHeaderMenu}
              onBack={() => setBgopenTo('')}
              selectedColor={selectedColor}
              onChangeBackground={onChangeBackground}
            />
          )}
        </div>
      )}
      {isArchiveOpen.isOpen && (
        <SettingsArchive
          board={board}
          openHeaderMenu={openHeaderMenu}
          toggleArchive={toggleArchive}
        />
      )}
      {isLabelsOpen.isOpen && (
        <TaskDetailsLabels
          board={board}
          onClose={toggleLabels}
        />
      )}
      {isActivityOpen.isOpen && (
        <Activities
          board={board}
          onClose={toggleActivity}
        />
      )}
    </section>
  )
}
