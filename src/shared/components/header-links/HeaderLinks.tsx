import React from 'react'
import { cn } from '@bem-react/classname'
import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { ArrowDropDown } from '@mui/icons-material'

import { SWAGGER } from 'app.constants'
import './HeaderLinks.scss'

const componentId = 'HeaderLinks'
const bem = cn(componentId)

export const HeaderLinks: React.FC<{ navigator: (location: string) => void }> = ({
  navigator,
}) => {
  return (
    <motion.div
      className={bem()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box className={bem('Links')}>
        <form>Product</form>
        <ArrowDropDown className={bem('Icon')} />
      </Box>

      <Box className={bem('Links')}>
        <form>About Us</form>
        <ArrowDropDown className={bem('Icon')} />
      </Box>

      <Box
        className={bem('Links')}
        onClick={() => {
          window.location.replace(SWAGGER)
        }}
      >
        <form>API</form>
        <ArrowDropDown className={bem('Icon')} />
      </Box>
    </motion.div>
  )
}
