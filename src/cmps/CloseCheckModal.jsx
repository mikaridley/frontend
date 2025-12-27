import closeIcon from '../assets/img/close.svg'

export function CloseCheckModal({
  onRemove,
  onCloseModal,
  text,
  moreText,
  buttonText,
  style,
}) {
  return (
    <div className="are-you-sure-close-board" style={style}>
      <header>
        <h3>{text}</h3>
        <img onClick={onCloseModal} src={closeIcon} />
      </header>
      {moreText && <p>{moreText}</p>}
      <button onClick={onRemove}>{buttonText}</button>
    </div>
  )
}
