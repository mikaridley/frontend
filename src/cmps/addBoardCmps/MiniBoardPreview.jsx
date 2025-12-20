import miniBoardImg from '../../assets/img/mini-board.png'

export function MiniBoardPreview({ selectedColor }) {
  const kind = selectedColor.kind === 'solid' ? 'backgroundColor' : 'background'

  return (
    <div
      className="mini-board-preview"
      style={
        selectedColor.kind === 'photo'
          ? { backgroundImage: `url(${selectedColor.color})` }
          : { [kind]: selectedColor.color }
      }
    >
      <img src={miniBoardImg} />
    </div>
  )
}
