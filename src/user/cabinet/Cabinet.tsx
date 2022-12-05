import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User } from 'shared/models/User'
import { userActions } from 'user/state/user.reducer'
import { selectUser } from 'user/state/user.selectors'

export const Cabinet: React.FC = () => {
  const user = useSelector(selectUser) as User

  const [name, setName] = useState(user.name)
  const [changName, setChangeName] = useState<Boolean>(false)

  const dispatch = useDispatch()

  const handleEditUsername = (): void => {
    setChangeName((prev) => !prev)
    if (changName) {
      dispatch(userActions.setUserName(name))
    }
  }

  const handleDelete = (): void => {
    dispatch(userActions.userDelete())
  }

  const changeName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value)
  }

  return (
    <div>
      <h1>Cabinet</h1>
      <p>
        Your name:{' '}
        {!changName ? (
          user.name
        ) : (
          <input type={'changName'} defaultValue={user.name} onChange={changeName} />
        )}{' '}
        <button onClick={handleEditUsername}>edit</button>
      </p>

      <button onClick={handleDelete}>DELETE ACCOUNT</button>
    </div>
  )
}
