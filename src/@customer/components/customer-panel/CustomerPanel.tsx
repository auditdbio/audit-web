import { Alert, Button, Grid, InputBase, InputLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@bem-react/classname'

import './CustomerPanel.scss'
import { Customer } from 'shared/models/customer'
import { onlySpaces } from 'shared/helpers/dataValodation'

const componentId = 'CustomerPanel'
const bem = cn(componentId)

const initialCustomerData: Customer = {
  _id: undefined,
  fname: '',
  lname: '',
  about: '',
  company: '',
  contacts: {
    email: '',
    telegram: '',
  },
}

type CustomerPanelProps = {
  customer: Customer | null
  remove: (id: string) => void
  errorMessage: string
  loading: boolean
  processing: boolean
  submit: (c: Customer) => void
  successMessage: string
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({
  customer,
  remove,
  errorMessage,
  loading,
  processing,
  successMessage,
  submit,
}) => {
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => event.preventDefault()
  const [customerData, setCustomerData] = useState<Customer>(initialCustomerData)

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    about: false,
    company: false,
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
    setCustomerData((prevState) => ({
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
    setCustomerData((prevState) => ({
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
      !onlySpaces(customerData.fname) &&
      customerData.fname.length > 0 &&
      !onlySpaces(customerData.fname) &&
      customerData.lname.length > 0 &&
      !onlySpaces(customerData.about) &&
      customerData.about.length > 0 &&
      !onlySpaces(customerData.contacts.email) &&
      customerData.contacts.email.length > 0
    ) {
      setErrors((state) => ({ ...state, noErrors: true }))
    } else {
      setErrors((state) => ({ ...state, noErrors: false }))
    }

    setErrors((state) => ({ ...state, errorMessage: '' }))
  }, [
    customerData.fname,
    customerData.lname,
    customerData.about,
    customerData.contacts.email,
  ])

  // Handle customer loaded from server
  useEffect(() => {
    if (customer) {
      setCustomerData(customer)
    } else {
      setCustomerData(initialCustomerData)
    }
  }, [customer])

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
                value={customerData.fname}
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
                value={customerData.lname}
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
                value={customerData.about}
                error={errors.fname}
                onChange={(e) =>
                  handleFieldChange(e as React.ChangeEvent<HTMLInputElement>, 'about')
                }
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="company-input" className={bem('InputLabel')}>
                Company
              </InputLabel>

              <InputBase
                id="company-input"
                className={bem('Input', { error: errors.company })}
                type="text"
                value={customerData.company}
                error={errors.fname}
                onChange={(e) =>
                  handleFieldChange(e as React.ChangeEvent<HTMLInputElement>, 'company')
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
                value={customerData.contacts.email}
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
                value={customerData.contacts.telegram}
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
                onClick={() => submit(customerData)}
              >
                {customerData._id ? 'Save' : 'Create'}
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
