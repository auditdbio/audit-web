import { Box, Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import TabList from '@mui/lab/TabList'
import { cn } from '@bem-react/classname'
import React from 'react'
import Tab from '@mui/material/Tab'

import './CustomerPage.scss'

import { Customer } from '@customer/containers/customer/Customer'

const componentId = 'CustomerPage'
const bem = cn(componentId)

export const CustomerPage: React.FC = () => {
  const [value, setValue] = React.useState('3')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <motion.div
      className="motion-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box className={bem()}>
        <Typography variant="h5" className={bem('Title')}>
          Customer
        </Typography>

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="Customer Page">
              <Tab label="Audits" value="1" />
              <Tab label="Projects" value="2" />
              <Tab label="Customer" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">Audits</TabPanel>
          <TabPanel value="2">Projects</TabPanel>
          <TabPanel value="3">
            <Customer />
          </TabPanel>
        </TabContext>
      </Box>
    </motion.div>
  )
}
