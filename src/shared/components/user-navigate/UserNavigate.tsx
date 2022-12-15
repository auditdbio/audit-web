import React from 'react'
import { cn } from '@bem-react/classname'
import { Link, Menu, MenuItem } from '@mui/material'
import { motion } from 'framer-motion'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'

import './UserNavigate.scss'

const componentId = 'UserNavigate'
const bem = cn(componentId)

export const UserNavigate: React.FC<{ navigator: (location: string) => void }> = ({
  navigator,
}) => {
  const [anchorAuEl, setAnchorAuEl] = React.useState<null | HTMLElement>(null)
  const [anchorPrEl, setAnchorPrEl] = React.useState<null | HTMLElement>(null)
  const openAu = Boolean(anchorAuEl)
  const openPr = Boolean(anchorPrEl)

  const auditorsHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAuEl(event.currentTarget)
  }
  const projectsHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorPrEl(event.currentTarget)
  }

  return (
    <motion.div
      className={bem()}
      data-testid={bem()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className={bem('Links', { audits: true })}
        aria-controls={openAu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openAu ? 'true' : undefined}
        onClick={auditorsHandler}
      >
        <Link className={bem('Link')}>Audits</Link>

        <ArrowDropDown className={bem('Icon')} />
      </div>

      <Menu
        className={bem('AuditsMenu')}
        data-testid={bem('AuditsMenu')}
        id="basic-menu"
        anchorEl={anchorAuEl}
        open={openAu}
        onClose={() => setAnchorAuEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* <MenuItem
          onClick={() => {
            navigator('/my-auditor')
            setAnchorAuEl(null)
          }}
        >
          Profile
        </MenuItem> */}

        <MenuItem>View audits</MenuItem>
      </Menu>

      {/* <div
        className={bem('Links', { projects: true })}
        aria-controls={openPr ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openPr ? 'true' : undefined}
        onClick={projectsHandler}
      >
        <Link className={bem('Link')}>Projects</Link>
        <ArrowDropDown className={bem('Icon')} />
      </div> */}

      <Menu
        className={bem('ProjectsMenu')}
        data-testid={bem('ProjectsMenu')}
        id="basic-menu"
        anchorEl={anchorPrEl}
        open={openPr}
        onClose={() => setAnchorPrEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            navigator('/my-customer')
            setAnchorAuEl(null)
          }}
        >
          Profile
        </MenuItem>

        <MenuItem>View projects</MenuItem>
      </Menu>
    </motion.div>
  )
}
