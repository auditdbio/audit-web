import { cn } from '@bem-react/classname'
import { AnyAction } from '@reduxjs/toolkit'
import { Menu, MenuItem } from '@mui/material'
import { KeyboardArrowDown } from '@mui/icons-material'
import React, { Dispatch, useState } from 'react'

import { sharedActions } from 'shared/state/shared.reducer'
import { AccountType } from 'shared/models/user'
import './UserTypeSwitch.scss'

const componentId = 'UserTypeSwitch'
const bem = cn(componentId)

export const UserTypeSwitch: React.FC<{
  userType: AccountType
  setType: Dispatch<AnyAction>
  navigator: (path: string) => void
}> = ({ userType, setType, navigator }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openDropdown = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
    console.log('open')
  }

  const handleClose = (): void => {
    setAnchorEl(null)
    console.log('close')
  }

  const switchToAuditor = (): void => {
    setType(sharedActions.setActiveUserType('auditor'))
    navigator('/auditor-page')
    handleClose()
  }

  const switchToCustomer = (): void => {
    setType(sharedActions.setActiveUserType('customer'))
    navigator('/customer-page')
    handleClose()
  }

  return (
    <div
      className={bem({
        auditor: userType === 'auditor',
        customer: userType === 'customer',
      })}
      data-testid={bem()}
    >
      <div className={bem('Button')} onClick={openDropdown}>
        <form className={bem('Type')}>
          {userType === 'auditor' ? 'Auditor' : 'Customer'}
        </form>
        <KeyboardArrowDown className={bem('Icon')} />
      </div>

      <Menu
        className={bem('Menu')}
        data-testid={bem('Menu')}
        id="account-menu"
        onClose={handleClose}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem
          className={bem('Auditor')}
          data-testid={bem('Auditor')}
          onClick={switchToAuditor}
        >
          Auditor
        </MenuItem>

        <MenuItem
          className={bem('Customer')}
          data-testid={bem('Customer')}
          onClick={switchToCustomer}
        >
          Customer
        </MenuItem>
      </Menu>
    </div>
  )
}
