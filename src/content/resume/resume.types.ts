// Shape follows the JSON Resume schema (https://jsonresume.org/schema) where it
// overlaps, with two additions the printed resume needs: `work[].note` and
// `earlierExperience`.

export interface ResumeProfile {
  network: string
  url: string
  label: string
}

export interface ResumeBasics {
  name: string
  label: string
  email: string
  phone?: string
  location: string
  url: string
  profiles: ResumeProfile[]
  summary: string
}

export interface ResumeSkill {
  name: string
  keywords: string[]
}

export interface ResumeWork {
  name: string
  position: string
  location: string
  /** `YYYY-MM` */
  startDate: string
  /** `YYYY-MM`; omitted for the current role */
  endDate?: string
  note?: string
  highlights: string[]
}

export interface ResumeEducation {
  institution: string
  studyType: string
  area: string
  endDate: string
}

export interface Resume {
  basics: ResumeBasics
  skills: ResumeSkill[]
  work: ResumeWork[]
  earlierExperience: string[]
  education: ResumeEducation[]
}
