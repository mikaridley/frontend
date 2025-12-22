import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

import { LightTooltip } from './LightToolTip'

import doneIcon from '../assets/img/done.svg'
import archiveIcon from '../assets/img/archive.svg'
import checklistImg from '../assets/img/checklist.svg'
import clockLightImg from '../assets/img/clock-light.svg'
import clockDarkImg from '../assets/img/clock-dark.svg'
import descriptionImg from '../assets/img/description.svg'
import commentsImg from '../assets/img/comments.svg'
import { SortableItem } from './SortableItem'

export function TaskPreview({ task, group, onToggleStatus, onArchiveTask }) {
  const board = useSelector(storeState => storeState.boardModule.board)
  const { title, status, id } = task
  const navigate = useNavigate()

  function openTaskDetails() {
    navigate(`/board/${board._id}/${group.id}/${id}`)
  }

  function getChecklistCount() {
    if (!task.checklists) return
    const itemsCount = task.checklists.reduce((acc, checklist) => {
      return acc + checklist.items.length
    }, 0)

    const checkedCount = task.checklists.reduce((acc, checklist) => {
      return (
        acc + checklist.items.filter(item => item.isChecked === true).length
      )
    }, 0)

    return { itemsCount, checkedCount }
  }

  function getDateStatus() {
    const now = new Date()
    const target = new Date(task.dates.dateTime)
    const diffMs = target - now
    const diffHours = diffMs / (1000 * 60 * 60)
    if (task.status === 'done') return 'done-green'
    else if (diffHours <= 0) return 'late-red'
    else if (diffHours <= 24) return 'soon-yellow'
    else return ''
  }

  function getDateToolipTitle() {
    if (getDateStatus() === 'done-green') return 'This card is complete.'
    else if (getDateStatus() === 'late-red')
      return 'This card is recently overdue!'
    else if (getDateStatus() === 'soon-yellow')
      return 'This card is due in less than twenty-four hours.'
    else return 'This card is due later.'
  }

  function formatDate() {
    const date = new Date(task.dates.dateTime)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const checkListCount = getChecklistCount()

  return (
    <SortableItem id={task.id}>
      <section className="task-preview" onClick={openTaskDetails}>
        {task.attachments && (
          <img className="task-attachment" src={task.attachments[0].file} />
        )}

        <section className="task-all-details">
          {task.labels && (
            <div className="task-labels-container">
              {task.labels.map(label => {
                return (
                  <LightTooltip
                    key={label.id}
                    title={`Color: ${label.colorName}, title: ${label.title === '' ? 'none' : '"' + label.title + '"'
                      }`}
                  >
                    <div
                      className="task-label"
                      style={{ backgroundColor: label.color }}
                    ></div>
                  </LightTooltip>
                )
              })}
            </div>
          )}

          <button
            className="toggle-done-btn"
            onClick={ev => onToggleStatus(ev, task)}
          >
            {status === 'done' ? <img src={doneIcon} /> : <div></div>}
          </button>
          <p
            className={`task-title ${status !== 'done' ? 'task-not-complete' : ''
              }`}
          >
            {title}
          </p>

          {status === 'done' && (
            <button className="archive-btn" onClick={event => onArchiveTask(event, task)}>
              <LightTooltip title={`Archive card`}>
                <img src={archiveIcon} />
              </LightTooltip>
            </button>
          )}

          {(task.checklists ||
            task.dates ||
            task.description ||
            task.members ||
            task.comments) && (
              <section className="task-details-container">
                {task.dates && (
                  <LightTooltip title={getDateToolipTitle()}>
                    <div className={`task-dates ${getDateStatus()}`}>
                      <img
                        src={getDateStatus() !== '' ? clockDarkImg : clockLightImg}
                      />
                      <p>{formatDate()}</p>
                    </div>
                  </LightTooltip>
                )}

                {task.description && (
                  <LightTooltip title={`This card has a description`}>
                    <img src={descriptionImg} />
                  </LightTooltip>
                )}

                {task.comments && (
                  <LightTooltip title={`Comments`}>
                    <div className="task-comments">
                      <img src={commentsImg} />
                      <p>{task.comments.length}</p>
                    </div>
                  </LightTooltip>
                )}

                {task.checklists && (
                  <LightTooltip title={`Checklist items`}>
                    <div className="task-checklists">
                      <img src={checklistImg} />
                      <p>{`${checkListCount.checkedCount}/${checkListCount.itemsCount}`}</p>
                    </div>
                  </LightTooltip>
                )}

                {task.members && (
                  <section className="task-user-container">
                    {task.members.map(member => (
                      <LightTooltip key={member._id} title={member.fullname}>
                        <div className="task-checklists">
                          <div className="task-user">RH</div>
                        </div>
                      </LightTooltip>
                    ))}
                  </section>
                )}
              </section>
            )}
        </section>
      </section>
    </SortableItem>
  )
}
