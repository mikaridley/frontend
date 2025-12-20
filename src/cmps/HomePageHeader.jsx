import { Link } from 'react-router-dom'

export function HomePageHeader() {
  return (
    <section className="home-page-header">
      <div className="header-content">
        <h1>logo</h1>
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
