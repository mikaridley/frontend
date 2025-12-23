import arrowDownIcon from '../../assets/imgs/icons/arrow_down.svg'
import { isImageFile } from '../../services/util.service'
import { taskService } from '../../services/task/task.service.local'
import { useNavigate } from 'react-router-dom'
export function TaskDetailsCover({ task, board, groupId, taskId, onTaskUpdate, onOpenPopup, attachments, boardId }) {
    const navigate = useNavigate()
    if (!board || !board.groups || !groupId) return null

    const group = board.groups.find(group => group.id === groupId)
    if (!group) return null

    function handleTransferClick(ev) {
        if (onOpenPopup) {
            onOpenPopup('transferTask', ev)
        }
    }
    const photoAttachments = attachments.filter(attachment =>
        isImageFile(attachment.type)
    )
    if (photoAttachments.length > 0) {
        taskService.getDominantColor(photoAttachments[0].file).then(color => {
            const el = document.querySelector('.task-details-cover')
            if (el) el.style.backgroundColor = color
        })
    } else {
        const el = document.querySelector('.task-details-cover')
        if (el) el.style.backgroundColor = 'transparent'
    }

    return (
        <div className="task-details-cover">
            <button
                className="group-transfer-btn"
                onClick={handleTransferClick}
                title={group.title}
            >
                {group.title}<img src={arrowDownIcon} alt="transfer" />
            </button>
            {photoAttachments.length > 0 && (
                <img src={photoAttachments[0].file} style={{ width: '100px', height: '100px', objectFit: 'cover', justifySelf: 'center' }} alt={photoAttachments[0].name} className="attachment-description-img" />
            )}
            <div className="task-details-cover-actions">
                helloooo
            </div>
            <button
                    className="modal-close-btn"
                    onClick={() => navigate(`/board/${boardId}`)}
                    aria-label="Close"
                >
                    ×
                </button>
        </div>
    )
}

