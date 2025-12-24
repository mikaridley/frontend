import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { logout } from '../store/actions/user.actions'
import logoLightImg from '../assets/img/logo-light.png'

export function AppHeader() {
  const { imgUrl, fullname } = useSelector(storeState => storeState.userModule.loggedinUser)
  const [isUserOpen, setIsUserOpen] = useState()
  const navigate = useNavigate()

  function onToggleUserOpen() {
    setIsUserOpen(isUserOpen => !isUserOpen)
  }

  async function onLogout() {
    navigate('/')
    await logout()
  }

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
      <div className="user" onClick={onToggleUserOpen}>
        {imgUrl && <img src={imgUrl} />}
      </div>
      {isUserOpen &&
        <div className='account'>
          <h2>account</h2>
          <div className='user-details'>
            {imgUrl && <img src={imgUrl} />}
            <h1>{fullname}</h1>
          </div>
          <button onClick={onLogout}>Log out</button>
        </div>
      }
    </section>
  )
}
