import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import { logout } from '../store/actions/user.actions'
import logoLightImg from '../assets/img/logo-light.png'
import {
  getDefaultFilter,
  loadBoards,
  loadFilteredBoards,
  setFilterBy,
} from '../store/actions/board.actions'
import { debounce } from '../services/util.service'

export function AppHeader() {
  const user = useSelector(storeState => storeState.userModule.user)
  const [isUserOpen, setIsUserOpen] = useState()
  const navigate = useNavigate()
  const filterBy = useSelector(storeState => storeState.boardModule.filterBy)
  const [boards, setBoards] = useState(null)
  const filterRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    async function fetchBoards() {
      const boards = await getBoards()
      setBoards(boards)
    }

    fetchBoards()
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
  }

  function toggleAddBoard() {
    if (location.pathname === '/board') {
      navigate('/board/add-board', { state: 'header' })
    } else {
      navigate('/board')
    }
  }
  if (user) {
    var { imgUrl, fullname } = user
  }

  return (
    <section className="app-header">
      <Link to="/board">
        <img className="logo" src={logoLightImg} />
      </Link>
      <section className="search-and-create">
        <form className="board-filter" ref={filterRef}>
          <input
            type="text"
            placeholder="Search"
            value={filterBy.title}
            onChange={handleChange}
          />
          {filterBy.title && (
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
        <div className="account">
          <h2>account</h2>
          <div className="user-details">
            {imgUrl && <img src={imgUrl} />}
            <h1>{fullname}</h1>
          </div>
          <button onClick={onLogout}>Log out</button>
        </div>
      )}
    </section>
  )
}
