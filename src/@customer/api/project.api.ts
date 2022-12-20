import { AxiosInstance } from 'axios'

import { MOCK_API, PORT_FOR_CUSTOMERS } from 'app.constants'
import { Project, mockedProject } from '@customer/models/project'
import api from 'app.api'

let http: AxiosInstance
const buildApi = () => (http = api(PORT_FOR_CUSTOMERS))

export const create = async (project: Project): Promise<Project> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Project>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...mockedProject,
          name: project.name,
          description: project.description,
          status: project.status,
          gitUrl: project.gitUrl,
          gitFolders: project.gitFolders,
        })
      }, 1000)
    })
  }

  try {
    const response = await http.post('/projects', project)

    return response.data
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}

export const get = async (projectId: string): Promise<Project | null> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Project>((resolve, reject) => {
      setTimeout(() => {
        resolve(mockedProject)
      }, 1000)
    })
  }

  try {
    const response = await http.get(`/projects/project?projectId=${projectId}`)

    return response.data
  } catch (e: any) {
    if (e.response.status === 404) {
      return null
    }

    throw new Error(e.response.data.message)
  }
}

export const getMy = async (customerId: string): Promise<Project[]> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Project[]>((resolve, reject) => {
      setTimeout(() => {
        resolve([mockedProject, mockedProject, mockedProject])
      }, 1000)
    })
  }

  try {
    const response = await http.get(`/projects/customer?customerId=${customerId}`)

    return response.data
  } catch (e: any) {
    if (e.response.status === 404) {
      return []
    }

    throw new Error(e.response.data.message)
  }
}

export const update = async (project: Project): Promise<Project> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Project>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...mockedProject,
          name: project.name,
          description: project.description,
          status: project.status,
          gitUrl: project.gitUrl,
          gitFolders: project.gitFolders,
        })
      }, 1000)
    })
  }

  try {
    const response = await http.patch('/projects', project)

    return response.data
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}
