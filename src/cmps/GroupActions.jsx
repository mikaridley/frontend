import closeIcon from '../assets/img/close.svg'

export function GroupActions({
  onToggleActions,
  onArchiveGroup,
  setIsAddingTask,
  groupActionsRef,
}) {
  return (
    <section className="group-actions flex column" ref={groupActionsRef}>
      <header className="actions-header grid">
        <h2>List actions</h2>
        <button onClick={onToggleActions}>
          <img src={closeIcon} />
        </button>
      </header>

      <button onClick={() => setIsAddingTask(true)}>Add card</button>
      <button onClick={onArchiveGroup}>Archive this list</button>
    </section>
  )
}
