import React, { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectUser } from 'user/state/user.selectors'

export const AuthGuard = ({ comp }: { comp: ReactNode }) => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  useEffect(() => {
    checkToken()
  }, [comp, user])

  const checkToken = () => {
    if (!user) {
      navigate(`/sign-in`)
    }
  }

  return !user ? (
    <React.Fragment></React.Fragment>
  ) : (
    <React.Fragment>{comp}</React.Fragment>
  )
}
