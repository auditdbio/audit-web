import { Button, Grid } from '@mui/material'
import { cn } from '@bem-react/classname'

import './ProjectsPanel.scss'
import { Project } from 'shared/models/project'
import { ProjectCard } from '@customer/components/project-card/ProjectCard'

const componentId = 'ProjectsPanel'
const bem = cn(componentId)

export type ProjectsPanelProps = {
  addProject: () => void
  deleteProject: (id: string) => void
  editProject: (project: Project) => void
  loading: boolean
  projects: Project[]
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({
  loading,
  projects,
  addProject,
  editProject,
  deleteProject,
}) => {
  return (
    <div className={bem()}>
      <div className={bem('Header')}>
        <Button className={bem('Button')} onClick={addProject}>
          + New Project
        </Button>
      </div>

      <Grid container spacing={2} className={bem('Projects')}>
        {loading
          ? 'Loading...'
          : projects.map((project) => (
              <Grid item xs={12} sm={6} md={6} key={project._id}>
                <ProjectCard
                  project={project}
                  onEdit={editProject}
                  onDelete={deleteProject}
                />
              </Grid>
            ))}
      </Grid>
    </div>
  )
}
