import React from 'react'
import Circle from '@mui/icons-material/Circle'
import { cn } from '@bem-react/classname'

import './StatusBar.scss'

const componentId = 'StatusBar'
const bem = cn(componentId)

export type StatusBarColor = 'green' | 'red' | 'primary' | 'secondary' | 'gray'

export const StatusBar: React.FC<{ color: StatusBarColor; desc: string }> = ({
  color,
  desc,
}) => {
  return (
    <div className={bem()}>
      <Circle
        className={bem('Indicator', {
          green: color === 'green',
          red: color === 'red',
          primary: color === 'primary',
          secondary: color === 'secondary',
          gray: color === 'gray',
        })}
      />
      <span className={bem('Desc')}>{desc}</span>
    </div>
  )
}
