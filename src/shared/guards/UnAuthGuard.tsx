import React, { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectUser } from 'user/state/user.selectors'

export const UnAuthGuard = ({ comp }: { comp: ReactNode }) => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const checkUser = (): void => {
    if (user?.accountType === 'customer') {
      navigate(`/customer-page`)
    } else if (user?.accountType === 'auditor') {
      navigate(`/auditor-page`)
    }
  }

  useEffect(() => {
    checkUser()
  }, [comp, user])

  return user ? (
    <React.Fragment></React.Fragment>
  ) : (
    <React.Fragment>{comp}</React.Fragment>
  )
}
