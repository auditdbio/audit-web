import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import TabContext from '@mui/lab/TabContext'
import { motion } from 'framer-motion'
import TabPanel from '@mui/lab/TabPanel'
import TabList from '@mui/lab/TabList'
import { cn } from '@bem-react/classname'
import Tab from '@mui/material/Tab'

import './CustomerPage.scss'
import {
  selectCustomer,
  selectCustomerAudits,
  selectCustomerErrorMessage,
  selectCustomerProjects,
  selectCustomerSuccessMessage,
  selectLoadingCustomer,
  selectProcessingCustomer,
} from '@customer/state/customer.selectors'
import { CustomerPanel } from '@customer/components/customer-panel/CustomerPanel'
import { customerActions } from '@customer/state/customer.reducer'
import { ProjectsPanel } from '@customer/components/projects-panel/ProjectsPanel'
import { Project } from 'shared/models/project'

const componentId = 'CustomerPage'
const bem = cn(componentId)

export const CustomerPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [value, setValue] = useState('3')
  const location = useLocation()

  const customer = useSelector(selectCustomer)
  const customerErrorMessage = useSelector(selectCustomerErrorMessage)
  const customerSuccessMessage = useSelector(selectCustomerSuccessMessage)
  const loadingCustomer = useSelector(selectLoadingCustomer)
  const processingCustomer = useSelector(selectProcessingCustomer)

  const projects = useSelector(selectCustomerProjects)
  const loadingProjects = useSelector(selectLoadingCustomer)

  const audits = useSelector(selectCustomerAudits)
  const loadingAudits = useSelector(selectLoadingCustomer)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const editProject = (project?: Project) => {
    dispatch(
      customerActions.setCustomerDataForProject([customer!._id!, project?._id || '']),
    )
    navigate('/project-page')
  }

  const submitCustomer = (customerData: any) =>
    customerData._id
      ? dispatch(customerActions.updateCustomer(customerData))
      : dispatch(customerActions.createCustomer(customerData))

  const deleteCustomer = (id: string) => dispatch(customerActions.deleteCustomer(id))

  // Load customer data on page load
  useEffect(() => {
    if (location?.state?.tab) {
      setValue(location.state.tab)
    } else dispatch(customerActions.loadCustomerData())
  }, [])

  // Load customer projects and audits on tab change
  useEffect(() => {
    if (value === '3') dispatch(customerActions.loadCustomerData())
    if (value === '2' && customer?._id)
      dispatch(customerActions.loadCustomerProjects(customer._id))
    if (value === '1' && customer?._id)
      dispatch(customerActions.loadCustomerAudits(customer._id))
  }, [value])

  return (
    <motion.div
      className="motion-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box className={bem()}>
        <span className={bem('Title')}>Customer</span>

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="Customer Page">
              <Tab label="Audits" value="1" disabled={!customer} />
              <Tab label="Projects" value="2" disabled={!customer} />
              <Tab label="Customer" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">Audits</TabPanel>
          <TabPanel value="2">
            <ProjectsPanel
              projects={projects}
              loading={loadingProjects}
              addProject={editProject}
              editProject={editProject}
              deleteProject={(id) => dispatch(customerActions.deleteProject(id))}
            />
          </TabPanel>
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
