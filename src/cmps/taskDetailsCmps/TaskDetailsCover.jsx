import { useEffect } from 'react'
import arrowDownIcon from '../../assets/imgs/icons/arrow_down.svg'
import { isImageFile } from '../../services/util.service'
import { taskService } from '../../services/task'
import { useNavigate } from 'react-router-dom'
import imageIcon from '../../assets/imgs/icons/image_icon.svg'
import { LightTooltip } from '../LightToolTip'
// receives an image url and updates the cover background
function setCoverBackgroundFromImage(imageUrl) {
  if (!imageUrl) return
  taskService
    .getDominantColor(imageUrl)
    .then(color => {
      const el = document.querySelector('.task-details-cover')
      if (el) el.style.backgroundColor = color
    })
    .catch(() => {
      const el = document.querySelector('.task-details-cover')
      if (el) el.style.backgroundColor = 'transparent'
    })
}

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
  if (!board || !board.groups || !groupId) return null

  const group = board.groups.find(group => group.id === groupId)
  if (!group) return null

  // distinguish between:
  // - cover is completely unset (no 'cover' prop on the task) -> we may fall back to first photo attachment
  // - cover was explicitly set to null (via "remove cover") -> show nothing, no fallback
  const hasCoverProp =
    task && Object.prototype.hasOwnProperty.call(task, 'cover')
  const cover = hasCoverProp ? task.cover : undefined

  const photoAttachments = attachments.filter(attachment =>
    isImageFile(attachment.type)
  )

  const shouldFallbackToAttachment =
    !hasCoverProp && photoAttachments.length > 0

  // decide which image to show (if any)
  const coverImageUrl =
    cover?.kind === 'photo'
      ? cover.color
      : shouldFallbackToAttachment
      ? photoAttachments[0].file
      : null

  // decide background style for color cover
  const coverStyle = {}
  if (cover && cover.kind !== 'photo') {
    // color-only cover (no image)
    // if you ever distinguish 'solid' vs 'gradient', you can branch here
    coverStyle.background = cover.color
  }

  useEffect(() => {
    // if user chose a photo cover, use that photo for background color
    if (cover?.kind === 'photo') {
      setCoverBackgroundFromImage(cover.color)
      return
    }

    // if cover is not set at all on the task (no 'cover' prop),
    // fall back to first photo attachment (visually treat it as the cover)
    if (shouldFallbackToAttachment) {
      setCoverBackgroundFromImage(photoAttachments[0].file)
      return
    }
    // cover explicitly removed or no image-based cover -> transparent background
    const el = document.querySelector('.task-details-cover')
    if (el) el.style.backgroundColor = 'transparent'
  }, [cover, photoAttachments, shouldFallbackToAttachment])

  function handleTransferClick(ev) {
    if (onOpenPopup) {
      onOpenPopup('transferTask', ev)
    }
  }

  return (
    <div className="task-details-cover" style={coverStyle}>
      <LightTooltip title={group.title}>
        <button
          className="group-transfer-btn"
          onClick={handleTransferClick}
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
        <LightTooltip title="cover">
          <button className="btn-image" onClick={e => onOpenPopup('cover', e)}>
            <img src={imageIcon} alt="image" />
          </button>
        </LightTooltip>
      </div>
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
  )
}
