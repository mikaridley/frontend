import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

import doneIcon from '../assets/img/done.svg'
import archiveIcon from '../assets/img/archive.svg'

export function TaskPreview({ task, group, onToggleStatus, archiveTask }) {
  const board = useSelector(storeState => storeState.boardModule.board)
  const { title, status } = task
  const navigate = useNavigate()
  function openTaskDetails() {
    navigate(`/board/${board._id}/${group.id}/${task.id}`)
  }

  function onArchiveTask(ev) {
    ev.stopPropagation()
    archiveTask(task)
  }

  return (
    <section className="task-preview" onClick={openTaskDetails}>
      <button
        className="toggle-done-btn"
        onClick={ev => onToggleStatus(ev, task)}
      >
        {status === 'done' ? <img src={doneIcon} /> : <div></div>}
      </button>
      <p className={status !== 'done' ? 'task-not-complete' : ''}>{title}</p>
      {status === 'done' && (
        <button className="archive-btn" onClick={onArchiveTask}>
          <img src={archiveIcon} />
        </button>
      )}
    </section>
  )
}
