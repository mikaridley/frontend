import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'

import { HomePage } from './pages/HomePage'
import { HomePageHeader } from './cmps/HomePageHeader'

import { BoardIndex } from './pages/BoardIndex'
import { BoardDetails } from './pages/BoardDetails'
import { TaskDetails } from './cmps/TaskDetails'
import { AddBoard } from './cmps/AddBoard'

import { LoginSignup } from './pages/LoginSignup'
import { UserMsg } from './cmps/UserMsg'

export function RootCmp() {
  const { pathname } = useLocation()

  const header = () => {
    if (pathname === '/login' || pathname === '/signup') return
    else if (pathname === '/') return <HomePageHeader />
    else return <AppHeader />
  }

  return (
    <div>
      <UserMsg />
      <main className={pathname === '/' ? 'home-page-layout' : 'main-layout'}>

        {header()}

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/board" element={<BoardIndex />}>
            <Route path="add-board" element={<AddBoard />} />
          </Route>
          <Route path="/board/:boardId" element={<BoardDetails />}>
            <Route path=":groupId/:taskId" element={<TaskDetails />} />
          </Route>

          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<LoginSignup />} />
        </Routes>
        {pathname === '/' ? <AppFooter /> : ''}
      </main>
    </div>
  )
}
