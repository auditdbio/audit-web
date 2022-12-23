import React from 'react'
import { cn } from '@bem-react/classname'
import './Tags.scss'

const componentId = 'Tags'
const bem = cn(componentId)

export const Tags: React.FC<{ tags: string }> = ({ tags }) => {
  const tagsArray = tags.split(',')
  return (
    <div className={bem()}>
      {tagsArray.map((tag) => (
        <div className={bem('Tag')}>{tag}</div>
      ))}
    </div>
  )
}
