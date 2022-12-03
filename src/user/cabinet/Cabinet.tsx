import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User } from 'shared/models/User'
import { userActions } from 'user/state/user.reducer'
import { selectUser } from 'user/state/user.selectors'

export const Cabinet: React.FC = () => {
  const user = useSelector(selectUser) as User

  const [email, setEmail] = useState(user.email)
  const [name, setName] = useState(user.name)
  const [emailEdit, setEmailEdit] = useState<Boolean>(false)
  const [passwordEdit, setPasswordEdit] = useState<Boolean>(false)

  const dispatch = useDispatch()

  const handleEditEmail = (): void => {
    setEmailEdit((prev) => !prev)
    if (emailEdit) {
      dispatch(userActions.setUserEmail(email))
    }
  }

  const handleEditUsername = (): void => {
    setPasswordEdit((prev) => !prev)
    if (passwordEdit) {
      dispatch(userActions.setUserName(name))
    }
  }

  const handleDelete = (): void => {
    dispatch(userActions.deleteUser())
  }

  const emailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value)
  }

  const nameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value)
  }

  return (
    <div>
      <h1>Cabinet</h1>
      <p>
        Your e-mail:{' '}
        {!emailEdit ? (
          user.email
        ) : (
          <input type={'emailEdit'} defaultValue={user.email} onChange={emailChange} />
        )}{' '}
        <button onClick={handleEditEmail}>edit</button>
      </p>

      <p>
        Your name:{' '}
        {!passwordEdit ? (
          user.name
        ) : (
          <input type={'passwordEdit'} defaultValue={user.name} onChange={nameChange} />
        )}{' '}
        <button onClick={handleEditUsername}>edit</button>
      </p>

      <button onClick={handleDelete}>DELETE ACCOUNT</button>
    </div>
  )
}
