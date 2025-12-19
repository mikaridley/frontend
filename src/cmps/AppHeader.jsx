import { Link } from 'react-router-dom'

export function AppHeader() {
  return (
    <section className="app-header">
      <h1>Marshmello</h1>
      <form className="search-icon">
        <input type="text" placeholder="Search" />
        <Link
          className="btn create-btn"
          to="/board/add-board"
          state={{ origin: 'header' }}
        >
          Create
        </Link>
      </form>
      <div className="user"></div>
    </section>
  )
}
