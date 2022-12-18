import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

import { Login } from 'user/containers/login/Login'
import { Profile } from 'user/containers/profile/Profile'
import { MainPage } from 'shared/containers/main/MainPage'
import { Registation } from 'user/containers/registration/Registation'
import { userActions } from 'user/state/user.reducer'
import { CustomerPage } from '@customer/components/customer-page/CustomerPage'
import { AuthGuard, UnAuthGuard } from 'shared/guards'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(userActions.restoreUserInfo())
    }
  }, [])

  return (
    <main className="App" style={{ width: '100%' }}>
      <Routes location={location} key={location.pathname}>
        <Route path="/main" element={<MainPage />} />
        <Route
          path="/auditor-page"
          element={<AuthGuard comp={<div>Here will be your auditor profile</div>} />}
        />
        <Route path="/customer-page" element={<AuthGuard comp={<CustomerPage />} />} />
        <Route path="/sign-in" element={<UnAuthGuard comp={<Login />} />} />
        <Route path="/sign-up" element={<UnAuthGuard comp={<Registation />} />} />
        <Route path="/profile" element={<AuthGuard comp={<Profile />} />} />
        <Route path="/*" element={<Navigate to="/main" />} />
      </Routes>
    </main>
  )
}

export default App
