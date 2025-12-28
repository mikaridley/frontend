import { useEffect, useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { removeGroup, updateGroup } from '../store/actions/group.actions'
import { removeTask, updateTask } from '../store/actions/task.actions'
import { PopUpHeader } from './addBoardCmps/PopUpHeader'
import { TaskPreview } from './TaskPreview'
import deleteImg from '../assets/img/delete.svg'
import restoreImg from '../assets/img/restore.svg'
import { useSelector } from 'react-redux'
import { CloseCheckModal } from './CloseCheckModal'

export function SettingsArchive({ openHeaderMenu, board, toggleArchive }) {
  const [isArchiveOpen, setIsArchiveOpen] = useState({
    isOpen: false,
    openTo: 'cards',
  })
  const [filterBy, setFilterBy] = useState('')
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [taskForDelete, setTaskForDelete] = useState('')
  const [groupForDelete, setGroupForDelete] = useState('')
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })

  function toggleArchiveopenTo() {
    const openTo = isArchiveOpen.openTo === 'cards' ? 'lists' : 'cards'
    setIsArchiveOpen({
      ...isArchiveOpen,
      openTo: openTo,
    })
  }

  async function onRestoreTask(groupId, taskId) {
    try {
      await updateTask(board, groupId, taskId, { archivedAt: null })
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to unArchive')
    }
  }

  async function onDeleteTask(groupId, taskId) {
    setIsRemoveModalOpen(false)
    try {
      await removeTask(board, groupId, taskId)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to unArchive')
    }
  }

  async function onRestoreGroup(group) {
    const edittedGroup = { ...group, archivedAt: null }
    try {
      await updateGroup(board, edittedGroup)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to unArchive')
    }
  }

  async function onDeleteGroup(group) {
    setIsRemoveModalOpen(false)
    try {
      await removeGroup(board, group.id)
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to remove')
    }
  }

  function handleChange({ target }) {
    setFilterBy(target.value)
  }

  function demoFunction() {}

  function getArchivedTasks() {
    const archivedTasks = board.groups
      .filter(group => !group.archivedAt)
      .flatMap(group =>
        group.tasks
          .filter(task => task.archivedAt)
          .map(task => ({
            ...task,
            groupId: group.id,
          }))
      )
    if (filterBy.length) {
      const archivedTasksFiltered = archivedTasks.filter(task =>
        task.title.toLowerCase().includes(filterBy.toLowerCase())
      )
      return archivedTasksFiltered
    }
    return archivedTasks
  }

  function getArchivedGroups() {
    const archivedGroups = board.groups.filter(group => group.archivedAt)

    if (filterBy.length) {
      const archivedGroupsFiltered = archivedGroups.filter(group =>
        group.title.toLowerCase().includes(filterBy.toLowerCase())
      )
      return archivedGroupsFiltered
    }
    return archivedGroups
  }

  function onToggleRemoveModal(ev, id) {
    setIsRemoveModalOpen(isRemoveModalOpen => !isRemoveModalOpen)
    const rect = ev.currentTarget.getBoundingClientRect()
    setModalPosition({
      top: rect.bottom + window.scrollY, // below the button
      left: rect.left + window.scrollX, // aligned to the button
    })
    setTaskForDelete(id)
    setGroupForDelete(id)
  }

  return (
    <div className="archived-tasks">
      <PopUpHeader
        onBack={toggleArchive}
        onClose={openHeaderMenu}
        header={'Archived items'}
      />
      <form>
        <input
          type="text"
          placeholder="Search archive..."
          onChange={handleChange}
          value={filterBy}
        />
        <button type="button" onClick={toggleArchiveopenTo}>{`${
          isArchiveOpen.openTo === 'cards'
            ? 'Switch to lists'
            : 'Switch to cards'
        }`}</button>
      </form>
      {isArchiveOpen.openTo === 'cards' ? (
        <div>
          {!getArchivedTasks().length && (
            <div className="no-archived-items">No archived cards</div>
          )}
          {getArchivedTasks().map(task => {
            return (
              <div key={task.id}>
                <TaskPreview
                  task={task}
                  onToggleStatus={demoFunction}
                  archiveTask={demoFunction}
                  isForArchiveList={true}
                />
                <div className="archived-actions">
                  <button onClick={() => onRestoreTask(task.groupId, task.id)}>
                    Restore
                  </button>
                  <p>•</p>
                  <button onClick={ev => onToggleRemoveModal(ev, task.id)}>
                    Delete
                  </button>

                  {isRemoveModalOpen && taskForDelete === task.id && (
                    <CloseCheckModal
                      onRemove={() => onDeleteTask(task.groupId, task.id)}
                      onCloseModal={ev => onToggleRemoveModal(ev, '')}
                      text={'Delete card?'}
                      moreText={
                        'All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.'
                      }
                      buttonText={'Delete'}
                      style={{
                        top: modalPosition.top - 50,
                        left: modalPosition.left - 70,
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <section className="archived-lists">
          {!getArchivedGroups().length && (
            <div className="no-archived-items">No archived lists</div>
          )}
          {getArchivedGroups().map(group => {
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
                  onClick={ev => onToggleRemoveModal(ev, group.id)}
                  className="settings-delete-icon"
                >
                  <img src={deleteImg} />
                </button>

                {isRemoveModalOpen && groupForDelete === group.id && (
                  <CloseCheckModal
                    onRemove={() => onDeleteGroup(group)}
                    onCloseModal={ev => onToggleRemoveModal(ev, '')}
                    text={'Delete list?'}
                    moreText={
                      'All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.'
                    }
                    buttonText={'Delete'}
                    style={{
                      top: modalPosition.top - 50,
                      left: modalPosition.left - 280,
                    }}
                  />
                )}
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
