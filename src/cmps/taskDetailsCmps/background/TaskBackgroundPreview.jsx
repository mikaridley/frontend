import { useSelector } from 'react-redux'

// Same API as the original BackgroundPreview, but with a safe photo value for big boards/tasks.
export function TaskBackgroundPreview({
  color,
  selectedColor,
  onChangeBackground,
  kind,
}) {
  const isLoading = useSelector(
    storeState => storeState.boardModule.backgroundLoader
  )

  const kindStyle = kind === 'gradient' ? 'background' : 'backgroundColor'

  // For photos, prefer full image URL, but gracefully fall back to the thumb if needed
  const bgToBigBoard =
    kind === 'photo' ? color.imageUrlFull || color.imageUrl : color

  const bgToSmallBoard = kind === 'photo' ? color.imageUrl : color

  return (
    <div
      className={`background-color ${
        selectedColor === bgToBigBoard ? 'active-background' : ''
      } ${kind === 'photo' ? 'background-photo' : ''}`}
      style={
        kind === 'photo'
          ? { backgroundImage: `url(${bgToSmallBoard})` }
          : { [kindStyle]: bgToSmallBoard }
      }
      onClick={() => onChangeBackground(bgToBigBoard, kind)}
    >
      {kind === 'photo' && (
        <div className="photo-bg-msg">
          {selectedColor === bgToBigBoard && isLoading ? (
            'Uploading...'
          ) : (
            <a
              href={color.authorLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {color.author}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
