import {
  Card,
  Button,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
} from '@mui/material'
import { useState } from 'react'
import { cn } from '@bem-react/classname'

import './ProjectCard.scss'
import { Project } from '@customer/models/project'

export type ProjectCardProps = {
  project: Project
  onDelete: (id: string) => void
  onEdit: (project: Project) => void
}

export const componentId = 'ProjectCard'
const bem = cn(componentId)

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const [state, setState] = useState({
    isHovered: false,
  })

  const handleMouseEnter = () => {
    setState((old) => ({ ...old, isHovered: true }))
  }

  const handleMouseLeave = () => {
    setState((old) => ({ ...old, isHovered: false }))
  }

  return (
    <Card
      className={bem()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent>
        <Typography className={bem('Name')} gutterBottom variant="h6" component="div">
          {project.name}
        </Typography>

        <Typography className={bem('Tags')} variant="body2" color="text.secondary">
          {project.tags}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          component="span"
          variant="contained"
          color="primary"
          className={bem('Button')}
          onClick={() => onEdit(project)}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  )
}
