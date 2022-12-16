import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

import 'App.scss'
import { Login } from 'user/containers/login/Login'
import { Profile } from 'user/containers/profile/Profile'
import { Registation } from 'user/containers/registration/Registation'
import { userActions } from 'user/state/user.reducer'
import { AuthGuard, UnAuthGuard } from 'shared/guards'
import { MainPage } from 'shared/containers/main/MainPage'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(userActions.restoreUserInfo())
    }
  }, [])

  return (
    <main className="App" style={{ width: '100vh' }}>
      <Routes location={location} key={location.pathname}>
        <Route path="/main" element={<MainPage />} />
        <Route
          path="/my-auditor"
          element={<AuthGuard comp={<div>Here will be your auditor profile</div>} />}
        />
        <Route
          path="/my-customer"
          element={<AuthGuard comp={<div>Here will be your customer profile</div>} />}
        />
        <Route path="/sign-in" element={<UnAuthGuard comp={<Login />} />} />
        <Route path="/sign-up" element={<UnAuthGuard comp={<Registation />} />} />
        <Route path="/profile" element={<AuthGuard comp={<Profile />} />} />
        <Route path="/*" element={<Navigate to="/main" />} />
      </Routes>
    </main>
  )
}

export default App
