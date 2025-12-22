export function SetBackgroundHeader({ onBack, onClose, header }) {
  return (
    <header className="background-header">
      <p className="back-btn-open-more-bgs" onClick={onBack}>
        &lt;
      </p>
      <h2>{header}</h2>
      <p onClick={onClose}>X</p>
    </header>
  )
}
