import { useEffect, useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { removeGroup, updateGroup } from '../store/actions/group.actions'
import { removeTask, updateTask } from '../store/actions/task.actions'
import { PopUpHeader } from './addBoardCmps/PopUpHeader'
import { TaskPreview } from './TaskPreview'
import deleteImg from '../assets/img/delete.svg'
import restoreImg from '../assets/img/restore.svg'
import { useSelector } from 'react-redux'

export function SettingsArchive({ openHeaderMenu, board }) {
  const [isArchiveOpen, setIsArchiveOpen] = useState({
    isOpen: false,
    openTo: 'cards',
  })
  const [filterBy, setFilterBy] = useState('')

  function toggleArchive() {
    setIsArchiveOpen({
      ...isArchiveOpen,
      isOpen: !isArchiveOpen.isOpen,
    })
  }

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
    const archivedTasks = board.groups.flatMap(group =>
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
        <>
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
                  <button onClick={() => onDeleteTask(task.groupId, task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </>
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
  )
}
