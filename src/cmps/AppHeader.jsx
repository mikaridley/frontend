import { Link } from 'react-router-dom'
import logoLightImg from '../assets/img/logo-light.png'

export function AppHeader() {
  return (
    <section className="app-header">
      <Link to="/board">
        <img className="logo" src={logoLightImg} />
      </Link>
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
