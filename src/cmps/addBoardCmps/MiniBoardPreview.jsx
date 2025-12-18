export function MiniBoardPreview({ selectedColor }) {
  return (
    <div
      className="mini-board-preview"
      style={{ backgroundColor: selectedColor }}
    >
      <div className="group"></div>
      <div className="group"></div>
      <div className="group"></div>
    </div>
  )
}
