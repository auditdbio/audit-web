export type ProjectState = 'new' | 'searing_for_audit'

export type Project = {
  _id: string
  name: string
  description: string
  state: ProjectState
  gitUrl: string
  gitFolders: Record<string, string>
  tags: string[]
  createdAt: string
  updatedAt: string
}
