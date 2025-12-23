import { Link } from 'react-router-dom'
import logoDarkImg from '../assets/img/logo-dark.png'
import { useEffect, useState } from 'react'

export function HomePageHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className={`home-page-header ${isScrolled ? 'scrolled' : ''}`}>
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
