import { Alert, Button, Grid, InputBase, InputLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@bem-react/classname'

import './AuditorPanel.scss'
import { Auditor } from '@auditor/models/auditor'
import { onlySpaces } from 'shared/helpers/dataValodation'

const componentId = 'AuditorPanel'
const bem = cn(componentId)

const initialAuditorData: Auditor = {
  _id: undefined,
  fname: '',
  lname: '',
  about: '',
  tags: '',
  contacts: {
    email: '',
    telegram: '',
  },
}

type AuditorPanelProps = {
  auditor: Auditor | null
  remove: (id: string) => void
  errorMessage: string
  loading: boolean
  processing: boolean
  submit: (a: Auditor) => void
  successMessage: string
}

export const AuditorPanel: React.FC<AuditorPanelProps> = ({
  auditor,
  remove,
  errorMessage,
  loading,
  processing,
  successMessage,
  submit,
}) => {
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => event.preventDefault()
  const [auditorData, setAuditorData] = useState<Auditor>(initialAuditorData)

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    about: false,
    tags: false,
    contacts: {
      email: false,
      telegram: false,
    },
    noErrors: true,
    errorMessage: '',
  })

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ): void => {
    setAuditorData((prevState) => ({
      ...prevState,
      [field]: event.target.value.trim(),
    }))

    setErrors((prevState) => ({
      ...prevState,
      [field]: false,
    }))
  }

  const handleContactsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    contact: string,
  ): void => {
    setAuditorData((prevState) => ({
      ...prevState,
      contacts: {
        ...prevState.contacts,
        [contact]: event.target.value.trim().toLowerCase(),
      },
    }))

    setErrors((prevState) => ({
      ...prevState,
      contacts: {
        ...prevState.contacts,
        [contact]: false,
      },
    }))
  }

  // Check for errors in form
  useEffect(() => {
    if (
      !onlySpaces(auditorData.fname) &&
      auditorData.fname.length > 0 &&
      !onlySpaces(auditorData.fname) &&
      auditorData.lname.length > 0 &&
      !onlySpaces(auditorData.about) &&
      auditorData.about.length > 0 &&
      !onlySpaces(auditorData.contacts.email) &&
      auditorData.contacts.email.length > 0
    ) {
      setErrors((state) => ({ ...state, noErrors: true }))
    } else {
      setErrors((state) => ({ ...state, noErrors: false }))
    }

    setErrors((state) => ({ ...state, errorMessage: '' }))
  }, [
    auditorData.fname,
    auditorData.lname,
    auditorData.about,
    auditorData.contacts.email,
  ])

  // Handle auditor loaded from server
  useEffect(() => {
    if (auditor) {
      setAuditorData(auditor)
    } else {
      setAuditorData(initialAuditorData)
    }
  }, [auditor])

  // Handle server error
  useEffect(() => {
    if (errorMessage) {
      setErrors((state) => ({
        ...state,
        noErrors: false,
        errorMessage,
      }))
    }
  }, [errorMessage])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form autoComplete="off" onSubmit={submitForm}>
          <Grid container spacing={2} className={bem()}>
            <Grid item xs={12}>
              <InputLabel htmlFor="fname-input" className={bem('InputLabel')}>
                First Name
              </InputLabel>

              <InputBase
                id="fname-input"
                className={bem('Input', { error: errors.fname })}
                type="text"
                value={auditorData.fname}
                error={errors.fname}
                onChange={(e) =>
                  handleFieldChange(e as React.ChangeEvent<HTMLInputElement>, 'fname')
                }
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="lname-input" className={bem('InputLabel')}>
                Last Name
              </InputLabel>

              <InputBase
                id="lname-input"
                className={bem('Input', { error: errors.lname })}
                type="text"
                value={auditorData.lname}
                error={errors.fname}
                onChange={(e) =>
                  handleFieldChange(e as React.ChangeEvent<HTMLInputElement>, 'lname')
                }
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="about-input" className={bem('InputLabel')}>
                About
              </InputLabel>

              <InputBase
                id="about-input"
                className={bem('Input', { error: errors.about })}
                type="text"
                value={auditorData.about}
                error={errors.fname}
                onChange={(e) =>
                  handleFieldChange(e as React.ChangeEvent<HTMLInputElement>, 'about')
                }
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="tags-input" className={bem('InputLabel')}>
                Tags
              </InputLabel>

              <InputBase
                id="tags-input"
                className={bem('Input', { error: errors.tags })}
                type="text"
                value={auditorData.tags}
                error={errors.fname}
                onChange={(e) =>
                  handleFieldChange(e as React.ChangeEvent<HTMLInputElement>, 'tags')
                }
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="email-input" className={bem('InputLabel')}>
                Email
              </InputLabel>

              <InputBase
                id="email-input"
                className={bem('Input', { error: errors.contacts.email })}
                type="text"
                value={auditorData.contacts.email}
                error={errors.contacts.email}
                onChange={(e) =>
                  handleContactsChange(e as React.ChangeEvent<HTMLInputElement>, 'email')
                }
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="telegram-input" className={bem('InputLabel')}>
                Telegram
              </InputLabel>

              <InputBase
                id="telegram-input"
                className={bem('Input', { error: errors.contacts.telegram })}
                type="text"
                value={auditorData.contacts.telegram}
                error={errors.fname}
                onChange={(e) =>
                  handleContactsChange(
                    e as React.ChangeEvent<HTMLInputElement>,
                    'telegram',
                  )
                }
              />
            </Grid>

            <Grid item xs={12} display="flex">
              <Button
                className={bem('Button', { disabled: !errors.noErrors || processing })}
                data-testid={bem('Button')}
                type="submit"
                variant="contained"
                disabled={!errors.noErrors || processing}
                sx={{ mt: 4 }}
                onClick={() => submit(auditorData)}
              >
                {auditorData._id ? 'Save' : 'Create'}
              </Button>
            </Grid>
          </Grid>

          {errors.errorMessage ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert className={bem('Alert', { error: true })} severity="error">
                {errors.errorMessage}
              </Alert>
            </motion.div>
          ) : null}

          {successMessage ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert className={bem('Alert', { success: true })} severity="success">
                {successMessage}
              </Alert>
            </motion.div>
          ) : null}
        </form>
      )}
    </motion.div>
  )
}
