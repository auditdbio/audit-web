import { cn } from '@bem-react/classname'
import React from 'react'

import './Girls.scss'

const bem = cn('Girl')

export const LeftGirl = () => {
  return (
    <div className={bem({ Left: true })}>
      <img className={bem('Img')} src="images/left-girl.svg" alt="Background image" />
    </div>
  )
}
