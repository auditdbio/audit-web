import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import TabList from '@mui/lab/TabList'
import { cn } from '@bem-react/classname'
import Tab from '@mui/material/Tab'

import './AuditorPage.scss'
import {
  selectAuditor,
  selectAuditorErrorMessage,
  selectAuditorSuccessMessage,
  selectLoadingAuditor,
  selectProcessingAuditor,
} from '@auditor/state/auditor.selectors'
import { AuditorPanel } from '@auditor/components/auditor-panel/AuditorPanel'
import { auditorActions } from '@auditor/state/auditor.reducer'

const componentId = 'AuditorPage'
const bem = cn(componentId)

export const AuditorPage: React.FC = () => {
  const dispatch = useDispatch()

  const auditor = useSelector(selectAuditor)
  const auditorErrorMessage = useSelector(selectAuditorErrorMessage)
  const auditorSuccessMessage = useSelector(selectAuditorSuccessMessage)
  const loadingAuditor = useSelector(selectLoadingAuditor)
  const processingAuditor = useSelector(selectProcessingAuditor)

  const [value, setValue] = React.useState('2')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const submitAuditor = (auditorData: any) =>
    auditorData._id
      ? dispatch(auditorActions.updateAuditor(auditorData))
      : dispatch(auditorActions.createAuditor(auditorData))

  const deleteAuditor = (id: string) => dispatch(auditorActions.deleteAuditor(id))

  // Load auditor data
  useEffect(() => {
    if (value === '2') dispatch(auditorActions.loadAuditorData())
  }, [value, dispatch])

  return (
    <motion.div
      className="motion-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box className={bem()}>
        <span className={bem('Title')}>Auditor</span>

        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label="Auditor Page"
            className={bem('Tabs')}
          >
            <Tab
              label="Audits"
              value="1"
              className={bem('Tab', { active: value === '1' })}
            />
            <Tab
              label="Auditor"
              value="2"
              className={bem('Tab', { active: value === '2' })}
            />
          </TabList>
          <TabPanel value="1" className={bem('TabPanel')}>
            Audits
          </TabPanel>
          <TabPanel value="2" className={bem('TabPanel')}>
            <AuditorPanel
              auditor={auditor}
              errorMessage={auditorErrorMessage}
              loading={loadingAuditor}
              processing={processingAuditor}
              successMessage={auditorSuccessMessage}
              remove={deleteAuditor}
              submit={submitAuditor}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </motion.div>
  )
}
