import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg'
import { LoginSignup } from './pages/LoginSignup'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { BoardIndex } from './pages/BoardIndex'
import { BoardDetails } from './pages/BoardDetails'
import { TaskDetails } from './cmps/TaskDetails'
import { AddBoard } from './cmps/AddBoard'
import { useLocation } from 'react-router-dom'
import { HomePageHeader } from './cmps/HomePageHeader'

export function RootCmp() {
  const location = useLocation()

  return (
    <div>
      <UserMsg />
      <main className="main-layout">
        {location.pathname === '/' ? <HomePageHeader /> : <AppHeader />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route> */}
          <Route path="/board" element={<BoardIndex />}>
            <Route path="add-board" element={<AddBoard />} />
          </Route>
          <Route path="/board/:boardId" element={<BoardDetails />}>
            <Route path=":groupId/:taskId" element={<TaskDetails />} />
          </Route>
          <Route path="login" element={<LoginSignup />}>
            <Route index element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </main>
      <AppFooter />
    </div>
  )
}
