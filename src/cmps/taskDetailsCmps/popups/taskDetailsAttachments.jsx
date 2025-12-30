import { useState, useEffect, useRef } from 'react'
import { taskService } from '../../../services/task'
import { makeId, isImageFile } from '../../../services/util.service'
import { showErrorMsg } from '../../../services/event-bus.service'
import { popupToViewportHook } from '../../../customHooks/popupToViewportHook'
import { uploadService } from '../../../services/upload.service'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const ALLOWED_FILE_TYPES = [
    // images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml',
    // documents
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // archives
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    // other
    'application/json',
    'text/csv'
]

//responsible for adding a new attachment
export function TaskDetailsAttachments({ board, groupId, taskId, onClose, onSave, position }) {
    const [attachments, setAttachments] = useState([])
    const [attachmentName, setAttachmentName] = useState('')
    const [fileDataUrl, setFileDataUrl] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null) //needed for the custom button
    const popupRef = useRef(null)

    useEffect(() => {
        const task = taskService.getTaskById(board, groupId, taskId)
        if (task?.attachments && Array.isArray(task.attachments)) {
            setAttachments(task.attachments)
        } else {
            setAttachments([])
        }
    }, [board, groupId, taskId])

  // keep popup fully visible vertically
  popupToViewportHook(popupRef, position)

    function onFileInput(ev) {
        const file = ev.target.files[0]
        if (!file) return

        // validate file size
        if (file.size > MAX_FILE_SIZE) {
            showErrorMsg(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`)
            ev.target.value = ''
            return
        }

        // validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            showErrorMsg('File type not supported. Please use images or documents.')
            ev.target.value = ''
            return
        }

        setSelectedFile(file)
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

    async function handleSave(ev) {
        ev.preventDefault()
        if (!attachmentName.trim() || !selectedFile) return
        
        setIsUploading(true)
        try {
            // upload file to cloudinary via backend
            // use 'raw' for non-image files (documents, archives, etc.)
            const resourceType = isImageFile(selectedFile.type) ? 'image' : 'raw'
            const uploadResult = await uploadService.uploadFile(selectedFile, {
                folder: 'task-attachments',
                resource_type: resourceType
            })
            
            const fileUrl = uploadResult.url || uploadResult.secure_url
            const newAttachment = {
                id: makeId(),
                name: attachmentName,
                file: fileUrl,
                createdAt: Date.now(),
                type: selectedFile.type,
                size: selectedFile.size,
                public_id: uploadResult.public_id // store public_id for potential deletion
            }
            const updatedAttachments = [...attachments, newAttachment]
            setAttachments(updatedAttachments)
            
            // if the new attachment is a photo and there's no cover yet, set it as the cover
            const shouldSetCover = isImageFile(selectedFile.type) && (() => {
                const task = taskService.getTaskById(board, groupId, taskId)
                if (!task) return false
                const hasCoverProp = Object.prototype.hasOwnProperty.call(task, 'cover')
                const cover = hasCoverProp ? task.cover : undefined
                // set cover if: no cover property exists, or cover is empty/falsy (but not explicitly null)
                return !hasCoverProp || (cover !== null && !cover)
            })()
            
            setAttachmentName('')
            setFileDataUrl(null)
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''   //resets the input file
            
            // save attachments and cover together in a single update to avoid state sync issues
            const additionalChanges = {}
            if (shouldSetCover) {
                additionalChanges.cover = { color: fileUrl, kind: 'photo' }
            }
            await onSave('attachments', updatedAttachments, additionalChanges)
        } catch (err) {
            console.error('Failed to upload attachment:', err)
            showErrorMsg('Failed to upload file. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    function handleCustomButtonClick() {    // instead of using input file, for better styling
        fileInputRef.current?.click()
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div 
                ref={popupRef}
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
                    <button type="button" onClick={handleCustomButtonClick} disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Choose File'}
                    </button>
                    <button type="submit" disabled={isUploading || !selectedFile}>
                        {isUploading ? 'Uploading...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    )}

