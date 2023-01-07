import { motion } from 'framer-motion'
import React from 'react'
import Grid from '@mui/material/Unstable_Grid2'

import './Welcome.scss'
import { cn } from '@bem-react/classname'
import { Button } from '@mui/material'
import { LeftGirl } from 'assets/background-girl/LeftGirl'
import { RightGirl } from 'assets/background-girl/RightGirl'
import { AccountType } from 'shared/models/user'

const componentId = 'Welcome'
const bem = cn(componentId)

type WelcomeProps = {
  onSelect: (type: AccountType) => void
}
export const Welcome: React.FC<WelcomeProps> = ({ onSelect }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className={bem({}, ['wrapper'])} data-testid={bem()}>
        <LeftGirl />

        <Grid container spacing={3} className={bem('Grid')}>
          <Grid xs={12} display="flex">
            <span className={bem('Header')}>
              Start your project right now or audit like an expert
            </span>
          </Grid>

          <Grid xs={12} display="flex">
            <span className={bem('Text')}>
              AuditDb is a blockchain-based jobs platform that helps clients and
              freelancers connect. We provide efficient transactions with cryptocurrency,
              and robust protection through smart contracts - wherever you're based!
            </span>
          </Grid>

          <Grid xs={12} sm={6} display="flex">
            <Button
              color="secondary"
              variant="contained"
              className={bem('Button', { auditor: true })}
              onClick={() => onSelect('auditor')}
            >
              Become auditor
            </Button>
          </Grid>

          <Grid xs={12} sm={6} display="flex">
            <Button
              color="primary"
              variant="contained"
              className={bem('Button', { customer: true })}
              onClick={() => onSelect('customer')}
            >
              Show your project
            </Button>
          </Grid>
        </Grid>

        <RightGirl />
      </div>
    </motion.div>
  )
}
