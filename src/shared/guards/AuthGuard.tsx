import React, { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectUser } from 'user/state/user.selectors'

export const AuthGuard = ({ comp }: { comp: ReactNode }) => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const checkToken = () => {
    if (!user) {
      navigate(`/sign-in`)
    }
  }

  useEffect(() => {
    checkToken()
  }, [comp, user])

  return !user ? (
    <React.Fragment></React.Fragment>
  ) : (
    <React.Fragment>{comp}</React.Fragment>
  )
}
