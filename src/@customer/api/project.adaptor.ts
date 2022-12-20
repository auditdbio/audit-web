import { Project, ProjectStatus } from '@customer/models/project'

export type ServerProject = {
  _id?: string
  name: string
  description: string
  status: ProjectStatus
  gitUrl: string
  gitFolders: Record<string, string>
  tags: string[]
  customerId: string
  createdAt?: string
  updatedAt?: string
}

export const projectAdaptorIn = (project: ServerProject): Project => ({
  ...project,
  tags: project.tags.toString(),
})

export const projectAdaptorOut = (project: Project): ServerProject => ({
  ...project,
  tags: project.tags.split(','),
})
