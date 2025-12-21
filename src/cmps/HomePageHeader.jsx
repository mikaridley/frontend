import { Link } from 'react-router-dom'
import logoDarkImg from '../assets/img/logo-dark.png'

export function HomePageHeader() {
  return (
    <section className="home-page-header">
      <div className="header-content">
        <img src={logoDarkImg} />
        <nav>
          <Link to="/board" className="home-log-in">
            Log in
          </Link>
          <Link to="/board" className="home-log-in">
            Get Marshmello for free
          </Link>
        </nav>
      </div>
    </section>
  )
}
