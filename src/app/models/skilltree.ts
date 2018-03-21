import { Upgrade } from "./upgrade";

export interface Skilltree {
  id: string
  name?: string
  order?: number
  icon?: {
    material?: string
    data?: number
    glowing?: boolean
  }
  description?: string[]
  permission?: string
  skills: { [name: string]: Upgrade[] }
  mobtypes: string[]
  requiredLevel?: number
  maxLevel?: number
}
