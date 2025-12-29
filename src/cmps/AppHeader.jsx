import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import { logout } from '../store/actions/user.actions'
import { loadFilteredBoards, setFilterBy } from '../store/actions/board.actions'
import logoLightImg from '../assets/img/logo-light.png'
import logoIconImg from '../assets/img/logo-icon.png'

export function AppHeader() {
  const loggedinUser = useSelector(
    storeState => storeState.userModule.loggedinUser
  )
  const [isUserOpen, setIsUserOpen] = useState()
  const navigate = useNavigate()
  const filterBy = useSelector(storeState => storeState.boardModule.filterBy)
  const [boards, setBoards] = useState(null)
  const filterRef = useRef(null)
  const location = useLocation()
  const userRef = useRef(null)
  const inputRef = useRef(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isLogoSmall, setIsLogoSmall] = useState(window.innerWidth < 1100)

  useEffect(() => {
    if (filterBy.title) {
      fetchBoards()
    }
  }, [filterBy])

  useEffect(() => {
    function handleClickOutside(ev) {
      if (!filterRef.current?.contains(ev.target)) {
        clearFilter()
        setBoards(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(ev) {
      // if click is NOT inside user menu AND NOT on the user button
      if (
        !userRef.current?.contains(ev.target) &&
        !ev.target.closest('.user')
      ) {
        setIsUserOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    //for focus out of filter
    function handleClickOutside(ev) {
      if (!filterRef.current?.contains(ev.target)) {
        setIsInputFocused(false)
        setBoards(null)
        clearFilter()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    //for logo size
    function handleResize() {
      setIsLogoSmall(window.innerWidth < 1100)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function fetchBoards() {
    const boards = await getBoards()
    setBoards(boards)
  }

  async function getBoards() {
    try {
      return await loadFilteredBoards(filterBy)
    } catch {
      console.log('cant get boards')
    }
  }

  function handleChange({ target }) {
    setFilterBy({ title: target.value })
  }

  function onToggleUserOpen() {
    setIsUserOpen(isUserOpen => !isUserOpen)
  }

  async function onLogout() {
    navigate('/')
    await logout()
  }

  function clearFilter() {
    setFilterBy({ title: '' })
    setIsInputFocused(false)
  }

  async function onFocusInput() {
    setIsInputFocused(true)
    if (!boards) {
      fetchBoards()
    }
  }

  function toggleAddBoard() {
    if (location.pathname === '/board') {
      navigate('/board/add-board', { state: 'header' })
    } else {
      navigate('/board')
    }
  }

  const { imgUrl, fullname, email } = loggedinUser
  return (
    <section className="app-header">
      <Link to="/board">
        {isLogoSmall ? (
          <img className="logo-small" src={logoIconImg} />
        ) : (
          <img className="logo" src={logoLightImg} />
        )}
      </Link>
      <section className="search-and-create">
        <form className="board-filter" ref={filterRef}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={filterBy.title}
            onChange={handleChange}
            onFocus={onFocusInput}
          />
          {(filterBy.title || isInputFocused) && (
            <section className="filter-results">
              <h2>Boards</h2>
              {boards &&
                boards.map(board => {
                  const color = board.style.background.color
                  const kind = board.style.background.kind
                  const bgStyle =
                    kind === 'solid' ? 'backgroundColor' : 'background'
                  return (
                    <Link
                      onClick={clearFilter}
                      to={`/board/${board._id}`}
                      className="filter-result"
                    >
                      <div
                        className="filter-board-icon"
                        style={
                          kind === 'photo'
                            ? { backgroundImage: `url(${color})` }
                            : { [bgStyle]: color }
                        }
                      ></div>
                      <p>{board.title}</p>
                    </Link>
                  )
                })}
            </section>
          )}
        </form>

        <button
          className="btn create-btn"
          onClick={toggleAddBoard}
          state={{ origin: 'header' }}
        >
          Create
        </button>
      </section>

      <div className="user" onClick={onToggleUserOpen}>
        {imgUrl && <img src={imgUrl} />}
      </div>
      {isUserOpen && (
        <div className="account grid" ref={userRef}>
          <h2>Account</h2>
          <div className="user-details grid">
            {imgUrl && <img src={imgUrl} referrerPolicy="no-referrer" />}
            <h1>{fullname}</h1>
            <p>{email}</p>
          </div>
          <button onClick={onLogout}>Log out</button>
        </div>
      )}
    </section>
  )
}
