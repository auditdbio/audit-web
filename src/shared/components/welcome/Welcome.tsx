import { motion } from 'framer-motion'
import React from 'react'

import { cn } from '@bem-react/classname'
import './Welcome.scss'
import { Button } from '@mui/material'
import { AccountType } from 'shared/models/User'

const componentId = 'Welcome'
const bem = cn(componentId)

type WelcomeProps = {
  onSelect: (type: AccountType) => void
}
export const Welcome: React.FC<WelcomeProps> = ({ onSelect }) => {
  return (
    <motion.div
      className={bem()}
      data-testid={bem()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className={bem('Header')}>
        Start your project right now <br /> or audit like expert
      </h1>

      <div className={bem('Buttons')}>
        <Button
          variant="contained"
          className={bem('Button', { auditor: true })}
          onClick={() => onSelect('auditor')}
        >
          Become auditor
        </Button>

        <Button
          variant="contained"
          className={bem('Button', { customer: true })}
          onClick={() => onSelect('customer')}
        >
          Show your project
        </Button>
      </div>
    </motion.div>
  )
}
