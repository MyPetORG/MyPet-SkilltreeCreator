import { LevelRule } from '../../models/level-rule';
import { Upgrades } from '../../models/skills';

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
  skills: Upgrades
  mobtypes: string[]
  requiredLevel?: number
  maxLevel?: number
  messages: { rule: LevelRule, content: string }[]
  inheritance?: {
    skilltree?: string
  }
  requirements: string[]
}

export function createSkilltree(params: Partial<Skilltree>) {
  return {} as Skilltree;
}
