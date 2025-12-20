export function BackgroundPreview({
  color,
  selectedColor,
  onChangeBackground,
  kind,
}) {
  const kindStyle = kind === 'gradiant' ? 'background' : 'backgroundColor'

  return (
    <div
      className={`background-color ${
        selectedColor === color ? 'active-background' : ''
      } ${kind === 'photo' ? 'background-photo' : ''}`}
      style={
        kind === 'photo'
          ? { backgroundImage: `url(${color})` }
          : { [kindStyle]: color }
      }
      onClick={() => onChangeBackground(color, kind)}
    ></div>
  )
}
