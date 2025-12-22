export function BackgroundPreview({
  color,
  selectedColor,
  onChangeBackground,
  kind,
}) {
  const kindStyle = kind === 'gradiant' ? 'background' : 'backgroundColor'
  const bgToBigBoard = kind === 'photo' ? color.imageUrlFull : color
  const bgToSmallBoard = kind === 'photo' ? color.imageUrl : color
  return (
    <div
      className={`background-color ${
        selectedColor === bgToSmallBoard ? 'active-background' : ''
      } ${kind === 'photo' ? 'background-photo' : ''}`}
      style={
        kind === 'photo'
          ? { backgroundImage: `url(${bgToSmallBoard})` }
          : { [kindStyle]: bgToSmallBoard }
      }
      onClick={() => onChangeBackground(bgToBigBoard, kind)}
    ></div>
  )
}
