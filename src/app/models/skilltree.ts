import { Upgrade } from "./upgrade";
import { LevelRule } from "./level-rule";

export interface Skilltree {
  id: string
  name?: string
  order?: number
  weight?: number
  icon?: {
    material?: string
    glowing?: boolean
  }
  description?: string[]
  skills: { [name: string]: Upgrade[] }
  mobtypes: string[]
  requiredLevel?: number
  maxLevel?: number
  messages: { rule: LevelRule, content: string }[]
  inheritance?: {
    skilltree?: string
  }
  requirements: string[]
}
