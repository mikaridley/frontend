import { useState, useEffect, useRef } from 'react'
import { taskService } from '../../services/task/task.service.local'
import { makeId } from '../../services/util.service'
import { showErrorMsg } from '../../services/event-bus.service'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const ALLOWED_FILE_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export function TaskDetailsAttachments({ board, groupId, taskId, onClose, onSave, position }) {
    const [attachments, setAttachments] = useState([])
    const [attachmentName, setAttachmentName] = useState('')
    const [fileDataUrl, setFileDataUrl] = useState(null)
    const fileInputRef = useRef(null) //needed for the custom button

    useEffect(() => {
        const task = taskService.getTaskById(board, groupId, taskId)
        if (task?.attachments && Array.isArray(task.attachments)) {
            setAttachments(task.attachments)
        } else {
            setAttachments([])
        }
    }, [board, groupId, taskId])

    function onFileInput(ev) {
        const file = ev.target.files[0]
        if (!file) return

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            showErrorMsg(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`)
            ev.target.value = ''
            return
        }

        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            showErrorMsg('File type not supported. Please use images or documents.')
            ev.target.value = ''
            return
        }

        loadFileFromInput(ev, (dataUrl) => {
            setFileDataUrl(dataUrl)
            if (!attachmentName.trim()) {
                setAttachmentName(file.name || '')
            }
        })
    }

    function loadFileFromInput(ev, onFileReady) {
        const reader = new FileReader()
        reader.onload = function (event) {
            onFileReady(event.target.result)
        }
        reader.readAsDataURL(ev.target.files[0])
    }

    function handleSave(ev) {
        ev.preventDefault()
        if (!attachmentName.trim() || !fileDataUrl) return
        
        const newAttachment = {
            id: makeId(),
            name: attachmentName,
            file: fileDataUrl,
            createdAt: Date.now()
        }
        const updatedAttachments = [...attachments, newAttachment]
        setAttachments(updatedAttachments)
        setAttachmentName('')
        setFileDataUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''   //resets the input file
        onSave('attachments', updatedAttachments)
    }

    function handleDelete(id) {
        const updatedAttachments = attachments.filter(attachment => attachment.id !== id)
        setAttachments(updatedAttachments)
        onSave('attachments', updatedAttachments)
    }

    function handleCustomButtonClick() {    //instead of using input file, for better styling
        fileInputRef.current?.click()
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div 
                className="popup-content popup-attachments" 
                onClick={(e) => e.stopPropagation()}
                style={position ? {
                    top: `${position.top}px`,
                    left: `${position.left}px`
                } : {}}
            >
                <button className="popup-close" onClick={onClose}>×</button>
                <h4>Attachments</h4>
                <form onSubmit={handleSave}>
                    <input type="text" placeholder="Text to display" value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} />
                    <input 
                        ref={fileInputRef}  //needed for the custom button
                        type="file" 
                        onChange={onFileInput}  //activates after selecting a file
                        style={{ display: 'none' }}
                    />
                    <button type="button" onClick={handleCustomButtonClick}>Choose File</button>
                    <button type="submit">Save</button>
                </form>
                <div className="attachments-list">
                    {attachments.map(attachment => (
                        <div key={attachment.id} className="attachment-item">
                            <img src={attachment.file} alt={attachment.name} />
                            <span>{attachment.name}</span>
                            <button onClick={() => handleDelete(attachment.id)}>Delete</button>
                        </div>
                    ))}
                </div>   
            </div>
        </div>
    )}