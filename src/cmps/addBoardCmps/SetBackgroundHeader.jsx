import closeImg from '../../assets/img/close.svg'
import backImg from '../../assets/img/back.svg'

export function SetBackgroundHeader({ onBack, onClose, header }) {
  return (
    <header className="background-header">
      <img src={backImg} onClick={onBack} />
      <h2>{header}</h2>
      <img src={closeImg} onClick={onClose} />
    </header>
  )
}
