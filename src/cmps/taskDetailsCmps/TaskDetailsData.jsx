import { taskService } from '../../services/task'
import { updateTask } from '../../store/actions/task.actions'
import { showErrorMsg } from "../../services/event-bus.service.js"
import arrowIcon from '../../assets/imgs/icons/arrow_right.svg'
import { getMemberInitials, isImageFile, getFileIcon, getColorNameFromHex } from '../../services/util.service'
import arrowDownIcon from '../../assets/imgs/icons/arrow_down.svg'
import attachmentsImg from '../../assets/img/attachments.svg'
import { LightTooltip } from '../LightToolTip'

//responsible for displaying the members, labels, dates, and attachments data ()
export function TaskDetailsData({ members, labels, attachments, dates, board, groupId, taskId, task, onOpenPopup, onTaskUpdate }) {

    async function handleDeleteAttachment(attachmentId) {
        if (!board) return
        const updatedAttachments = attachments.filter(attachment => attachment.id !== attachmentId)
        onTaskUpdate({ ...task, attachments: updatedAttachments })
        try {
            await updateTask(board, groupId, taskId, { attachments: updatedAttachments })
        } catch (err) {
            console.log('Error deleting attachment:', err)
            showErrorMsg('Cannot delete attachment')
        }
    }

    return (
        <>
            {(members.length > 0 || labels.length > 0 || dates) && (
                <div className="task-details-row">
                    {members.length > 0 && (
                        <div className="members">
                            <h5>Members</h5>
                            <div className="members-list">
                                {members.map(member => (
                                    <div
                                        key={member._id}
                                        className="member-tag"
                                    >
                                        <LightTooltip title={member.fullname}>
                                            <div className="member-avatar">
                                                {member.imgUrl && <img src={member.imgUrl} />}
                                            </div>
                                        </LightTooltip>
                                    </div>
                                ))}
                                <button className="btn-add-label" style={{ borderRadius: '50%' }} onClick={(e) => onOpenPopup('members', e)}> + </button>
                            </div>
                        </div>
                    )}
                    {labels.length > 0 && (
                        <div className="labels">
                            <h5>Labels</h5>
                            <div className="labels-list">
                                {labels.map((label, index) => {
                                    const colorName = label.colorName || getColorNameFromHex(label.color)
                                    return (
                                        <LightTooltip key={label.id}
                                            title={`Color: ${colorName}, title: ${label.title === '' ? 'none' : '"' + label.title + '"'}`}
                                        >
                                            <div
                                                key={label.id || label.color || index}
                                                className="label-tag"
                                                style={{
                                                    backgroundColor: label.color,
                                                    color: `color-mix(in srgb, ${label.color}, white 70%)`
                                                }}
                                                onClick={(e) => onOpenPopup('labels', e)}
                                            >
                                                {label.title || ' '}
                                            </div>
                                        </LightTooltip>
                                    )
                                })}
                                <button className="btn-add-label" onClick={(e) => onOpenPopup('labels', e)}> + </button>
                            </div>
                        </div>
                    )}
                    {dates && (
                        <div className="dates">
                            <h5>Due date</h5>
                            <button className="btn-date" onClick={(e) => onOpenPopup('dates', e)}>{new Date(dates.dateTime).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}
                                <img src={arrowDownIcon} />
                            </button>
                        </div>
                    )}
                </div>
            )}
            {attachments.length > 0 && (
                <div className="attachments">
                    <div className="attachments-header">
                        <div className="attachments-title">
                            <img src={attachmentsImg} alt="attachments" className="attachments-icon" />
                            <h5>Attachments</h5>
                        </div>
                        <button className="btn-add-attachment" onClick={(e) => onOpenPopup('attachments', e)}> Add </button>
                    </div>
                    <div className="attachments-list">
                        {attachments.map(attachment => (
                            <div key={attachment.id} className="attachment-item">
                                {isImageFile(attachment.type) ? (
                                    <img src={attachment.file} alt={attachment.name} className="attachment-thumbnail" />
                                ) : (
                                    <div className="attachment-file-icon">
                                        {getFileIcon(attachment.type)}
                                    </div>
                                )}
                                <div className="attachment-info">
                                    <div className="attachment-name">{attachment.name}</div>
                                    {attachment.createdAt && (
                                        <div className="attachment-date">
                                            Added {new Date(attachment.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </div>
                                    )}
                                </div>
                                <LightTooltip title="Show attachment">
                                    <button className="btn-show-attachment" onClick={() => taskService.openAttachmentInNewTab(attachment.file, attachment.type)}><img src={arrowIcon} alt="show attachment" /></button>
                                </LightTooltip>
                                <button className="btn-delete-attachment" onClick={() => handleDeleteAttachment(attachment.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

