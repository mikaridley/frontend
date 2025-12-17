export function AppHeader() {
  return (
    <section className="app-header">
      <h1>Trello</h1>
      <form className="search-icon">
        <input type="text" placeholder="Search" />
        <button>Create</button>
      </form>
      <div className="user"></div>
    </section>
  )
}
