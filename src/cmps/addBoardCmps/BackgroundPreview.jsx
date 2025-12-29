import { useSelector } from 'react-redux'

export function BackgroundPreview({
  color,
  selectedColor,
  onChangeBackground,
  kind,
  isForPreview,
}) {
  const isLoading = useSelector(
    storeState => storeState.boardModule.backgroundLoader
  )
  const kindStyle = kind === 'gradient' ? 'background' : 'backgroundColor'
  const bgToBigBoard = kind === 'photo' ? color.imageUrlFull : color
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
      {kind === 'photo' && !isForPreview && (
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
