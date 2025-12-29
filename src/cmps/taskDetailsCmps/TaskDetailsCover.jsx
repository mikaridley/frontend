import { useEffect, useRef } from 'react'
import arrowDownIcon from '../../assets/imgs/icons/arrow_down.svg'
import { isImageFile } from '../../services/util.service'
import { taskService } from '../../services/task'
import { useNavigate } from 'react-router-dom'
import imageIcon from '../../assets/imgs/icons/image_icon.svg'
import { LightTooltip } from '../LightToolTip'
import archiveIcon from '../../assets/img/archive.svg'
import { updateTask } from '../../store/actions/task.actions'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'

export function TaskDetailsCover({
  task,
  board,
  groupId,
  taskId,
  onTaskUpdate,
  onOpenPopup,
  attachments,
  boardId,
}) {
  const navigate = useNavigate()
  const coverRef = useRef(null)

  if (!board || !board.groups || !groupId) return null

  const group = board.groups.find(group => group.id === groupId)
  if (!group) return null

  async function onArchiveTask(task) {
    if (!board || !task) return
    try {
      await updateTask(board, groupId, task.id, { archivedAt: Date.now() })
      showSuccessMsg('Card archived')
      navigate(`/board/${boardId}`)
    } catch (err) {
      showErrorMsg('Failed to archive')
    }
  }

  const taskCover = task?.cover
  const hasCoverBeenSet = task && Object.prototype.hasOwnProperty.call(task, 'cover')
  const photoAttachments = attachments.filter(attachment => isImageFile(attachment.type))
  const firstPhotoAttachment = photoAttachments.length > 0 ? photoAttachments[0] : null

  let coverImageUrl = null
  let coverStyle = {}

  if (taskCover?.kind === 'photo') {
    coverImageUrl = taskCover.color
  } else if (!hasCoverBeenSet && firstPhotoAttachment) {
    coverImageUrl = firstPhotoAttachment.file
  }

  if (taskCover && taskCover.kind !== 'photo') {
    coverStyle.background = taskCover.color
  }

  useEffect(() => {
    if (!coverRef.current) return

    let isMounted = true
    const coverElement = coverRef.current

    function updateBackgroundColorFromImage(imageUrl) {
      if (!imageUrl) return
      
      taskService
        .getDominantColor(imageUrl)
        .then(color => {
          if (isMounted && coverElement) {
            coverElement.style.backgroundColor = color
          }
        })
        .catch(() => {
          if (isMounted && coverElement) {
            coverElement.style.backgroundColor = 'transparent'
          }
        })
    }

    if (taskCover?.kind === 'photo') {
      updateBackgroundColorFromImage(taskCover.color)
    } else if (!hasCoverBeenSet && firstPhotoAttachment) {
      updateBackgroundColorFromImage(firstPhotoAttachment.file)
    } else {
      coverElement.style.backgroundColor = 'transparent'
    }

    return () => {
      isMounted = false
    }
  }, [taskCover?.kind, taskCover?.color, hasCoverBeenSet, firstPhotoAttachment?.file])

  function handleTransferClick(ev) {
    onOpenPopup?.('transferTask', ev)
  }

  return (
    <div ref={coverRef} className="task-details-cover" style={coverStyle}>
      <LightTooltip title={group.title}>
        <button
          className="group-transfer-btn"
          onClick={handleTransferClick}
          aria-label={`Transfer task to ${group.title}`}
        >
          {group.title}
          <img src={arrowDownIcon} alt="transfer" />
        </button>
      </LightTooltip>
      {coverImageUrl && (
        <img
          src={coverImageUrl}
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            justifySelf: 'center',
          }}
          alt="Task cover"
          className="attachment-description-img"
        />
      )}
      <div className="task-details-cover-actions">
        <LightTooltip title="Cover">
          <button 
            className="btn-image" 
            onClick={e => onOpenPopup('cover', e)}
            aria-label="Change cover"
          >
            <img src={imageIcon} alt="image" />
          </button>
        </LightTooltip>
        <LightTooltip title="Archive">
          <button 
            className="btn-archive" 
            onClick={() => onArchiveTask(task)}
            aria-label="Archive task"
          >
            <img src={archiveIcon} alt="archive" />
          </button>
        </LightTooltip>
        <LightTooltip title="Close">
          <button
            className="modal-close-btn"
            onClick={() => navigate(`/board/${boardId}`)}
            aria-label="Close"
          >
            ×
          </button>
        </LightTooltip>
      </div>
    </div>
  )
}
