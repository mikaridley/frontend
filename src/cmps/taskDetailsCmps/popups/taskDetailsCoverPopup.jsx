import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { popupToViewportHook } from '../../../customHooks/popupToViewportHook'
import { getColorsBg, getPhotos } from '../../../store/actions/board.actions'
import { TaskBackgroundPreview } from '../background/TaskBackgroundPreview'
import { uploadService } from '../../../services/upload.service'
import { showErrorMsg } from '../../../services/event-bus.service'

export function TaskDetailsCoverPopup({
  board,
  groupId,
  taskId,
  onClose,
  onSave,
  position,
}) {
  const popupRef = useRef(null)
  const fileInputRef = useRef(null)
  // popupToViewportHook(popupRef, position)

  const backgrounds = getColorsBg()
  const photosBg = useSelector(
    storeState => storeState.boardModule.backgroundPhotos
  )

  const [selectedColor, setSelectedColor] = useState({ color: '#0079bf', kind: 'solid' })
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    // Ensure Unsplash photos are loaded
    getPhotos().catch(err => console.error('Failed to load backgrounds', err))
  }, [])

  function handleChangeCover({ color, kind }) {
    setSelectedColor({ color, kind })
    onSave('cover', { color, kind })
  }

  function onRemoveCover() {
    onSave('cover', null)
  }

  function onUploadButtonClick() {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  async function onFileInputChange(ev) {
    const file = ev.target.files?.[0]
    if (!file) return

    // Validate file type (only images for cover)
    if (!file.type.startsWith('image/')) {
      showErrorMsg('Please select an image file')
      ev.target.value = ''
      return
    }

    setIsUploading(true)
    try {
      // Upload file to Cloudinary via backend
      const uploadResult = await uploadService.uploadFile(file, {
        folder: 'task-covers',
        resource_type: 'image'
      })
      
      const imageUrl = uploadResult.url || uploadResult.secure_url
      // Save uploaded image as cover (same shape as Unsplash photos)
      handleChangeCover({ color: imageUrl, kind: 'photo' })
    } catch (err) {
      console.error('Failed to upload cover image:', err)
      showErrorMsg('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (ev.target) ev.target.value = ''
    }
  }

  const gradientColors = backgrounds.gradientColors || []
  const solidColors = backgrounds.solidColors || []
  const allColors = [...gradientColors, ...solidColors]
  const topTenColors = allColors.slice(0, 10)

  const unsplashPhotos = photosBg.slice(0, 6)

  // Check if position.left + 300 is out of viewport
  const viewportWidth =
    typeof window !== 'undefined'
      ? window.innerWidth || document.documentElement.clientWidth
      : 0
  const leftOffset = position && position.left + 350 > viewportWidth ? 300 : 0

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        ref={popupRef}
        className="popup-content popup-cover"
        onClick={e => e.stopPropagation()}
        style={
          position
            ? {
                top: `${position.top}px`,
                left: `${position.left - leftOffset}px`,
              }
            : {}
        }
      >
        <button className="popup-close" onClick={onClose}>
          ×
        </button>
        <h4>Task cover</h4>

        <button className="btn-remove-cover" onClick={onRemoveCover}>
          Remove cover
        </button>

        <h5>Colors</h5>
        <div className="cover-colors-grid">
          {topTenColors.map((color, idx) => (
            <TaskBackgroundPreview
              key={idx}
              color={color}
              selectedColor={selectedColor.color}
              onChangeBackground={(colorVal, kind) =>
                handleChangeCover({ color: colorVal, kind })
              }
              kind={gradientColors.includes(color) ? 'gradient' : 'solid'}
            />
          ))}
        </div>

        <h5>Attachments</h5>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onFileInputChange}
        />
        <button 
          className="btn-upload-cover" 
          onClick={onUploadButtonClick}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload cover image'}
        </button>

        <h5>Photo from Unsplash</h5>
        <div className="cover-photos-grid">
          {unsplashPhotos.map(photo => (
            <TaskBackgroundPreview
              key={photo.id}
              color={photo}
              selectedColor={selectedColor.color}
              onChangeBackground={(colorVal, kind) =>
                handleChangeCover({ color: colorVal, kind })
              }
              kind="photo"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
