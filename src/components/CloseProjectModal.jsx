import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { closeProject } from '../redux/actions/projectAction.js'
import theme from '../styles/themes.js'
import { DONE } from '../redux/actions/types.js'

const CloseProjectModal = ({ isOpen, setIsOpen, handleSubmit, values, setIsClosed, projectInfo }) => {
  const dispatch = useDispatch()

  const handleDisagree = () => {
    setIsOpen(false)
  }

  const handleAgree = (values, handleSubmit) => {
    setIsClosed(true)
    const newValue = {...values, status: DONE}
    if (values.id && projectInfo.id) {
      dispatch(closeProject({ ...newValue, id: projectInfo.id }))
    } else {
      handleSubmit()
    }
    setIsOpen(false)
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleDisagree}
      >
        <DialogTitle>
          Are you sure you want to close the project?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDisagree} variant={'contained'}>
            Disagree
          </Button>
          <Button
            onClick={() => handleAgree(values, handleSubmit)}
            variant={'contained'}
            sx={agreeButton}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CloseProjectModal

const agreeButton = {
  backgroundColor: theme.palette.secondary.main,
  transition: 'filter 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    filter: 'brightness(70%)',
  },

}
