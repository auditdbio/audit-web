import { cn } from '@bem-react/classname'
import React from 'react'

import './Girls.scss'

const bem = cn('Girl')

export const RightGirl = () => {
  return (
    <div className={bem({ Right: true })}>
      <img className={bem('Img')} src="images/right-girl.svg" alt="Background image" />
    </div>
  )
}
