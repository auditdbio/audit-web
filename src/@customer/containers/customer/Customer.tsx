import { Button, Grid, InputBase, InputLabel } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@bem-react/classname'

import './Customer.scss'
import { customerActions } from '@customer/state/customer.reducer'
import { selectCustomer, selectLoadingCustomer } from '@customer/state/customer.selectors'

const componentId = 'Customer'
const bem = cn(componentId)

export const Customer: React.FC = () => {
  const customer = useSelector(selectCustomer)
  const loading = useSelector(selectLoadingCustomer)
  const dispatch = useDispatch()

  useEffect(() => {
    customerActions.loadCustomerData()
  }, [])

  const handleSubmit = (): void => {
    if (customerData._id) {
      dispatch(customerActions.createCustomer(customerData))
    } else {
      dispatch(customerActions.updateCustomer(customerData))
    }
  }

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const [customerData, setCustomerData] = useState({
    _id: undefined,
    fname: '',
    lname: '',
    about: '',
    company: '',
    contacts: {
      email: '',
      telegram: '',
    },
  })

  const [errors, setErrorsState] = useState({
    fname: false,
    lname: false,
    about: false,
    company: false,
    contacts: {
      email: false,
      telegram: false,
    },
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

    setErrorsState((prevState) => ({
      ...prevState,
      [field]: false,
    }))
  }

  const handleContactChange = (
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

    setErrorsState((prevState) => ({
      ...prevState,
      contacts: {
        ...prevState.contacts,
        [contact]: false,
      },
    }))
  }

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
                error={errors.contacts.email}
                onChange={(e) =>
                  handleContactChange(e as React.ChangeEvent<HTMLInputElement>, 'email')
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
                error={errors.fname}
                onChange={(e) =>
                  handleContactChange(
                    e as React.ChangeEvent<HTMLInputElement>,
                    'telegram',
                  )
                }
              />
            </Grid>

            <Grid item xs={12} display="flex">
              <Button
                className={bem('Button')}
                data-testid={bem('Button')}
                type="submit"
                variant="contained"
                // disabled={!state.canLog || loging}
                sx={{ mt: 4 }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </motion.div>
  )
}
