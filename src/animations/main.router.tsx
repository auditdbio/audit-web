import { cn } from '@bem-react/classname'
import { Login } from 'user/containers/login/Login'
import { Registation } from 'user/containers/registration/Registation'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MainPage } from 'shared/containers/main/MainPage'

export const componentId = 'MainRouter'

const bem = cn(componentId)

export const MainRouter = () => {
  const location = useLocation()
  return (
    <AnimatePresence>
      <div className={bem()} data-testid={bem()}>
        <Routes location={location} key={location.pathname}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Registation />} />
          <Route path="/*" element={<Navigate to="/main" />} />
        </Routes>
      </div>
    </AnimatePresence>
  )
}
