import { Auditor, AuditorContacts } from '@auditor/models/auditor'

export type ServerAuditor = {
  about: string
  tags: string[]
  contacts: AuditorContacts
  fname: string
  lname: string
}

export const auditorAdaptorIn = (auditor: ServerAuditor): Auditor => ({
  ...auditor,
  tags: auditor.tags.toString(),
})

export const auditorAdaptorOut = (auditor: Auditor): ServerAuditor => ({
  ...auditor,
  tags: auditor.tags.split(','),
})
