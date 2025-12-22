import { useState } from 'react'
import { useSelector } from 'react-redux'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { TaskList } from './TaskList'
import { GroupActions } from './GroupActions'

import { addTask, updateTask } from '../store/actions/task.actions'
import { taskService } from '../services/task'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import moreIcon from '../assets/img/more.svg'
import closeIcon from '../assets/img/close.svg'

export function GroupPreview({ group, onUpdateGroup, archiveGroup }) {
  const board = useSelector(storeState => storeState.boardModule.board)

  const [title, setTitle] = useState(group.title)
  const [isActionsOpen, setIsActionsOpen] = useState(false)

  const [task, setTask] = useState(taskService.getEmptyTask())
  const [isAddingTask, setIsAddingTask] = useState(false)

  async function onAddTask() {
    setIsAddingTask(false)
    if (!task.title) return

    try {
      await addTask(board, group, task)
      showSuccessMsg('Added')

      setTask(taskService.getEmptyTask())
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to Add')
    }
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    await onAddTask()
  }

  async function archiveTask(task) {
    try {
      const archivedAt = Date.now()
      setTask(taskService.getEmptyTask())
      await updateTask(board, group.id, task.id, { archivedAt })
      showSuccessMsg('Task archived')
    } catch (err) {
      console.log('err:', err)
      showErrorMsg('Failed to archive')
    }
  }
  function onArchiveGroup() {
    onToggleActions()
    archiveGroup(group)
  }

  async function onToggleStatus(ev, task) {
    ev.stopPropagation()

    const newStatus = task.status === 'done' ? 'inProgress' : 'done'

    try {
      await updateTask(board, group.id, task.id, { status: newStatus })
      setTask({ ...task, status: newStatus })
      showSuccessMsg('Task status updated')
    } catch (err) {
      showErrorMsg('Failed to update task status')
    }
  }

  function onToggleActions() {
    setIsActionsOpen(prev => !prev)
  }

  function handleGroupChange({ target }) {
    const value = target.value
    setTitle(value)
  }

  function handleTaskChange({ target }) {
    const value = target.value
    setTask(prevTask => ({ ...prevTask, title: value }))
  }

  if (!group.tasks) return

  return (
    <section className="group-preview flex column">
      <header className="group-header flex space-between">
        <input
          className="title-input"
          onChange={handleGroupChange}
          onBlur={() => onUpdateGroup(title, group)}
          value={title}
        />
        <button onClick={onToggleActions}>
          <img src={moreIcon} alt="More actions" />
        </button>
        {isActionsOpen && (
          <GroupActions
            onToggleActions={onToggleActions}
            onArchiveGroup={onArchiveGroup}
            setIsAddingTask={setIsAddingTask}
          />
        )}
      </header>

      <SortableContext
        items={group.tasks ? group.tasks.map(task => task.id) : []}
        strategy={verticalListSortingStrategy}
      >
        <TaskList
          group={group}
          onToggleStatus={onToggleStatus}
          archiveTask={archiveTask}
        />
      </SortableContext>

      {!isAddingTask ? (
        <button className="add-btn" onClick={() => setIsAddingTask(true)}>
          Add a Card
        </button>
      ) : (
        <form className="add-form" onSubmit={handleSubmit}>
          <input
            onChange={handleTaskChange}
            onBlur={onAddTask}
            placeholder="Enter a title"
            autoFocus
            value={task.title || ''}
          />
          <div className="form-btns flex">
            <button className="btn" onMouseDown={handleSubmit}>
              Add Card
            </button>
            <button type="button" onClick={() => setIsAddingTask(false)}>
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
