export type ProjectStatus = 'shown' | 'hidden'

export type Project = {
  _id?: string
  name: string
  description: string
  status: ProjectStatus
  gitUrl: string
  gitFolders: Record<string, string>
  tags: string
  customerId: string
  createdAt?: string
  updatedAt?: string
}

export const mockedProject: Project = {
  _id: '1',
  name: 'Project 1',
  description: 'Project 1 description',
  status: 'shown',
  gitUrl: 'https://mygit.com/project1.git',
  gitFolders: {
    src: 'src',
    public: 'public',
  },
  tags: 'tag1,tag2',
  customerId: '1',
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
}
