import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import TabList from '@mui/lab/TabList'
import { cn } from '@bem-react/classname'
import Tab from '@mui/material/Tab'

import './CustomerPage.scss'
import {
  selectCustomer,
  selectCustomerErrorMessage,
  selectCustomerSuccessMessage,
  selectLoadingCustomer,
  selectProcessingCustomer,
} from '@customer/state/customer.selectors'
import { CustomerPanel } from '@customer/containers/customer-panel/CustomerPanel'
import { customerActions } from '@customer/state/customer.reducer'

const componentId = 'CustomerPage'
const bem = cn(componentId)

export const CustomerPage: React.FC = () => {
  const dispatch = useDispatch()

  const customer = useSelector(selectCustomer)
  const customerErrorMessage = useSelector(selectCustomerErrorMessage)
  const customerSuccessMessage = useSelector(selectCustomerSuccessMessage)
  const loadingCustomer = useSelector(selectLoadingCustomer)
  const processingCustomer = useSelector(selectProcessingCustomer)

  const [value, setValue] = React.useState('3')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const submitCustomer = (customerData: any) =>
    customerData._id
      ? dispatch(customerActions.updateCustomer(customerData))
      : dispatch(customerActions.createCustomer(customerData))

  const deleteCustomer = (id: string) => dispatch(customerActions.deleteCustomer(id))

  // Load customer data
  useEffect(() => {
    if (value === '3') dispatch(customerActions.loadCustomerData())
  }, [value])

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
            <CustomerPanel
              customer={customer}
              errorMessage={customerErrorMessage}
              loading={loadingCustomer}
              processing={processingCustomer}
              successMessage={customerSuccessMessage}
              remove={deleteCustomer}
              submit={submitCustomer}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </motion.div>
  )
}
