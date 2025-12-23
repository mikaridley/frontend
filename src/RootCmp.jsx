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

import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { UserMsg } from './cmps/UserMsg'

export function RootCmp() {
  const location = useLocation()

  return (
    <div>
      <UserMsg />
      <main
        className={location.pathname === '/' ? 'home-page-layout' : 'main-layout'}
      >
        {location.pathname === '/' ? <HomePageHeader /> : <AppHeader />}
        
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/board" element={<BoardIndex />}>
            <Route path="add-board" element={<AddBoard />} />
          </Route>
          <Route path="/board/:boardId" element={<BoardDetails />}>
            <Route path=":groupId/:taskId" element={<TaskDetails />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        {location.pathname === '/' ? <AppFooter /> : ''}
      </main>
    </div>
  )
}
