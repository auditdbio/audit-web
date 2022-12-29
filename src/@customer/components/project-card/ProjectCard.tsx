import {
  Card,
  Button,
  CardContent,
  Typography,
  CardActions,
  Avatar,
  Dialog,
  DialogContent,
} from '@mui/material'
import { useRef, useState } from 'react'
import { cn } from '@bem-react/classname'

import './ProjectCard.scss'
import { Project } from 'shared/models/project'
import { ProjectInfo } from '../customer-info/ProjectInfo'
import { StatusBar } from 'shared/components/status-bar/StatusBar'
import { useLocation } from 'react-router-dom'

export type ProjectCardProps = {
  project: Project
  onDelete?: (id: string) => void
  onEdit?: (project: Project) => void
}

export const componentId = 'ProjectCard'
const bem = cn(componentId)

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const [infoDialog, setInfoDialog] = useState(false)
  const location = useLocation()
  const showStatus = location.pathname !== '/main'
  const [state, setState] = useState({
    isHovered: false,
  })

  const [avatar, setAvatar] = useState(
    `/images/avatar/${Math.floor(Math.random() * 10)}.jpg`,
  )

  const handleMouseEnter = () => {
    setState((old) => ({ ...old, isHovered: true }))
  }

  const handleMouseLeave = () => {
    setState((old) => ({ ...old, isHovered: false }))
  }

  const closeInfoDialog = () => {
    setInfoDialog(false)
  }

  return (
    <Card
      className={bem()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent>
        <Avatar className={bem('Avatar')} alt={project.name} src={avatar} />

        <Typography
          className={bem('Name')}
          title={project.name}
          gutterBottom
          variant="h6"
          component="div"
        >
          {project.name}
        </Typography>

        <Typography
          className={bem('Tags')}
          title={project.tags}
          variant="body2"
          color="text.secondary"
        >
          {project.tags}
        </Typography>

        {showStatus ? (
          <StatusBar
            color={project.status === 'shown' ? 'green' : 'secondary'}
            desc={project.status === 'shown' ? 'Published' : 'Unpublished'}
          />
        ) : null}
      </CardContent>

      <CardActions>
        {onEdit ? (
          <Button
            component="span"
            variant="contained"
            color="primary"
            className={bem('Button')}
            onClick={() => onEdit(project)}
          >
            Edit
          </Button>
        ) : (
          <Button
            component="span"
            variant="contained"
            color="primary"
            className={bem('Button')}
            onClick={() => {
              setInfoDialog(true)
            }}
          >
            More Info
          </Button>
        )}
      </CardActions>

      <Dialog open={infoDialog} onClose={closeInfoDialog}>
        <DialogContent>
          <ProjectInfo project={project} avatarUrl={avatar} close={closeInfoDialog} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
