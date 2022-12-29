import React from 'react'

export type StatusBarColor = 'green' | 'red' | 'orange' | 'primary' | 'secondary'

export const StatusBar: React.FC<{ color: StatusBarColor; desc: string }> = ({
  color,
  desc,
}) => {
  return <div></div>
}
