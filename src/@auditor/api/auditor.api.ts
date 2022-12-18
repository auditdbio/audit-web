import { AxiosInstance } from 'axios'

import { MOCK_API, PORT_FOR_AUDITORS } from 'app.constants'
import { auditorAdaptorIn, auditorAdaptorOut } from '@auditor/api/auditor.adaptor'
import { Auditor, mockedAuditor } from '@auditor/models/auditor'
import api from 'app.api'

let http: AxiosInstance
const buildApi = () => (http = api(PORT_FOR_AUDITORS))

export const create = async (auditor: Auditor): Promise<Auditor> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Auditor>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...mockedAuditor,
          fname: auditor.fname,
          lname: auditor.lname,
          tags: auditor.tags,
          about: auditor.about,
          contacts: auditor.contacts,
        })
      }, 1000)
    })
  }

  try {
    const response = await http.post('/auditors', auditorAdaptorOut(auditor))

    return auditorAdaptorIn(response.data)
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}

export const get = async (): Promise<Auditor | null> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Auditor>((resolve, reject) => {
      setTimeout(() => {
        resolve(mockedAuditor)
      }, 1000)
    })
  }

  try {
    const response = await http.get('/auditors')

    return auditorAdaptorIn(response.data)
  } catch (e: any) {
    if (e.response.status === 404) {
      return null
    }

    throw new Error(e.response.data.message)
  }
}

export const update = async (auditor: Auditor): Promise<Auditor> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Auditor>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...mockedAuditor,
          fname: auditor.fname,
          lname: auditor.lname,
          tags: auditor.tags,
          about: auditor.about,
          contacts: auditor.contacts,
        })
      }, 1000)
    })
  }

  try {
    const response = await http.patch('/auditors', auditorAdaptorOut(auditor))

    return auditorAdaptorIn(response.data)
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}
