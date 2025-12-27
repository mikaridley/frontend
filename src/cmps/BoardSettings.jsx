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
import { PopUpHeader } from './addBoardCmps/PopUpHeader'
import photosImg from '../assets/img/photos.jpg'
import colorsImg from '../assets/img/colors.png'
import { ColorsBackground } from './addBoardCmps/ColorsBackground'
import { getColorsBg, getPhotos } from '../store/actions/board.actions'
import { MemberDefaultPhoto } from './MemberDefaultPhoto'
import { TaskPreview } from './TaskPreview'
import { removeTask, updateTask } from '../store/actions/task.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { removeGroup, updateGroup } from '../store/actions/group.actions'
import deleteImg from '../assets/img/delete.svg'
import restoreImg from '../assets/img/restore.svg'

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
    openTo: '',
  })
  const [isArchiveOpen, setIsArchiveOpen] = useState({
    isOpen: false,
    openTo: 'cards',
  })
  const [selectedColor, setSelectedColor] = useState(board.style.background)
  const photosBg = useSelector(
    storeState => storeState.boardModule.backgroundPhotos
  )
  const backgrounds = getColorsBg()
  const loggedinUser = useSelector(
    storeState => storeState.userModule.loggedinUser
  )

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

  function toggleArchiveopenTo() {
    const openTo = isArchiveOpen.openTo === 'cards' ? 'lists' : 'cards'
    setIsArchiveOpen({
      ...isArchiveOpen,
      openTo: openTo,
    })
  }

  function onChangeBackground(color, kind) {
    setSelectedColor({ color, kind })
    changeBoardColor({ color, kind })
  }

  function demoFunction() {}

  async function onRestoreTask(groupId, taskId) {
    try {
      await updateTask(board, groupId, taskId, { archivedAt: null })
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to unArchive')
    }
  }

  async function onDeleteTask(groupId, taskId) {
    try {
      await removeTask(board, groupId, taskId)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to unArchive')
    }
  }

  async function onRestoreGroup(group) {
    console.log(group)
    const edittedGroup = { ...group, archivedAt: null }
    try {
      await updateGroup(board, edittedGroup)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to unArchive')
    }
  }

  async function onDeleteGroup(group) {
    try {
      await removeGroup(board, group.id)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to remove')
    }
  }

  const archivedTasks = board.groups.flatMap(group =>
    group.tasks
      .filter(task => task.archivedAt)
      .map(task => ({
        ...task,
        groupId: group.id,
      }))
  )
  const archivedGroups = board.groups.filter(group => group.archivedAt)

  const { kind, color } = board.style.background
  const bgStyle = kind === 'solid' ? 'backgroundColor' : 'background'
  return (
    <section className="board-settings">
      {!isChangeBackgroundOpen.isOpen && !isArchiveOpen.isOpen && (
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
                  <div key={member._id} className="member-photo">
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
      )}{' '}
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
        <div className="archived-tasks">
          <PopUpHeader
            onBack={toggleArchive}
            onClose={openHeaderMenu}
            header={'Archived items'}
          />
          <form>
            <input type="text" placeholder="Search archive..." />
            <button type="button" onClick={toggleArchiveopenTo}>{`${
              isArchiveOpen.openTo === 'cards'
                ? 'Switch to lists'
                : 'Switch to cards'
            }`}</button>
          </form>
          {isArchiveOpen.openTo === 'cards' ? (
            <>
              {!archivedTasks.length && (
                <div className="no-archived-items">No archived cards</div>
              )}
              {archivedTasks.map(task => {
                return (
                  <div key={task.id}>
                    <TaskPreview
                      task={task}
                      onToggleStatus={demoFunction}
                      archiveTask={demoFunction}
                      isForArchiveList={true}
                    />
                    <div className="archived-actions">
                      <button
                        onClick={() => onRestoreTask(task.groupId, task.id)}
                      >
                        Restore
                      </button>
                      <p>•</p>
                      <button
                        onClick={() => onDeleteTask(task.groupId, task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <section className="archived-lists">
              {!archivedGroups.length && (
                <div className="no-archived-items">No archived lists</div>
              )}
              {archivedGroups.map(group => {
                return (
                  <div className="settings-group-preview" key={group.id}>
                    <h2>{group.title}</h2>
                    <button
                      className="settings-restore-icon"
                      onClick={() => onRestoreGroup(group)}
                    >
                      <img src={restoreImg} />
                      Restore
                    </button>
                    <button
                      onClick={() => onDeleteGroup(group)}
                      className="settings-delete-icon"
                    >
                      <img src={deleteImg} />
                    </button>
                  </div>
                )
              })}
            </section>
          )}
        </div>
      )}
    </section>
  )
}
