import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import { updateTask } from '../../store/actions/task.actions'
import { showErrorMsg } from "../../services/event-bus.service.js"
import { isImageFile } from '../../services/util.service'
import descriptionImg from '../../assets/img/description.svg'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'

export function TaskDetailsDescription({ description: initialDescription, attachments, board, groupId, taskId, task, onTaskUpdate }) {
    const [description, setDescription] = useState(initialDescription || '')
    const [descriptionEdit, setDescriptionEdit] = useState(false)

    useEffect(() => {
        setDescription(initialDescription || '')
    }, [initialDescription])

    function editDescription() {
        setDescriptionEdit(true)
    }

    async function saveDescription(ev) {
        ev.preventDefault()
        if (!board) return
        try {
            await updateTask(board, groupId, taskId, { description })
            onTaskUpdate({ ...task, description })
            setDescriptionEdit(false)
        } catch (err) {
            console.log('Error saving description:', err)
            showErrorMsg('Cannot save description')
        }
    }

    return (
        <div className="description">
            <div className="description-header">
                <img src={descriptionImg} alt="description" className="description-icon" />
                <h5>Description</h5>
            </div>
            {!descriptionEdit && (
                <div onClick={editDescription} className="task-description-button">
                    {description ? (
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                    ) : (
                        <>
                            {(() => {
                                // filter to get only photo/image attachments
                                const photoAttachments = attachments.filter(attachment => 
                                    isImageFile(attachment.type)
                                )
                                return photoAttachments.length > 0 ? (
                                    <img src={photoAttachments[0].file} style={{ width: '100px', height: '100px', objectFit: 'cover', justifySelf: 'center' }} alt={photoAttachments[0].name} className="attachment-description-img" />
                                ) : (
                                    <span>Add a more detailed description...</span>
                                )
                            })()}
                        </>
                    )}
                </div>
            )}
            {descriptionEdit && (
                <form onSubmit={saveDescription}>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        placeholder="Add a more detailed description..."
                    />
                    <button type="submit" onClick={saveDescription}>Save</button>
                    <button onClick={() => setDescriptionEdit(false)}>Cancel</button>
                </form>
            )}
        </div>
    )
}

