import { Fire } from "../models/skills/fire";
import { Knockback } from "../models/skills/knockback";
import { Poison } from "../models/skills/poison";
import { Lightning } from "../models/skills/lightning";
import { Ride } from "../models/skills/ride";
import { Slow } from "../models/skills/slow";
import { Sprint } from "../models/skills/sprint";
import { Stomp } from "../models/skills/stomp";
import { Thorns } from "../models/skills/thorns";
import { Wither } from "../models/skills/wither";
import { Beacon } from "app/models/skills/beacon";
import { Backpack } from "../models/skills/backpack";
import { Behavior } from "../models/skills/behavior";
import { Control } from "app/models/skills/control";
import { Pickup } from "../models/skills/pickup";
import { Ranged } from "../models/skills/ranged";
import { Shield } from "../models/skills/shield";

export interface SkillInfo {
  id: string,
  name: string,
  description: string,
  icon: string,
  premium?: boolean
}

export const Skills: SkillInfo[] = [
  {
    id: 'Backpack',
    name: 'SKILL_NAME__BACKPACK',
    description: 'SKILL_DESCRIPTION__BACKPACK',
    icon: 'backpack.png',
  },
  {
    id: 'Beacon',
    name: 'SKILL_NAME__BEACON',
    description: 'SKILL_DESCRIPTION__BEACON',
    icon: 'beacon.png',
  },
  {
    id: 'Behavior',
    name: 'SKILL_NAME__BEHAVIOR',
    description: 'SKILL_DESCRIPTION__BEHAVIOR',
    icon: 'behavior.png',
  },
  {
    id: 'Control',
    name: 'SKILL_NAME__CONTROL',
    description: 'SKILL_DESCRIPTION__CONTROL',
    icon: 'control.png',
  },
  {
    id: 'Damage',
    name: 'SKILL_NAME__DAMAGE',
    description: 'SKILL_DESCRIPTION__DAMAGE',
    icon: 'damage.png',
  },
  {
    id: 'Fire',
    name: 'SKILL_NAME__FIRE',
    description: 'SKILL_DESCRIPTION__FIRE',
    icon: 'fire.png',
  },
  {
    id: 'Heal',
    name: 'SKILL_NAME__HEAL',
    description: 'SKILL_DESCRIPTION__HEAL',
    icon: 'heal.png',
  },
  {
    id: 'Life',
    name: 'SKILL_NAME__LIFE',
    description: 'SKILL_DESCRIPTION__LIFE',
    icon: 'life.png',
  },
  {
    id: 'Knockback',
    name: 'SKILL_NAME__KNOCKBACK',
    description: 'SKILL_DESCRIPTION__KNOCKBACK',
    icon: 'knockback.png',
  },
  {
    id: 'Lightning',
    name: 'SKILL_NAME__LIGHTNING',
    description: 'SKILL_DESCRIPTION__LIGHTNING',
    icon: 'lightning.png',
  },
  {
    id: 'Pickup',
    name: 'SKILL_NAME__PICKUP',
    description: 'SKILL_DESCRIPTION__PICKUP',
    icon: 'pickup.png',
  },
  {
    id: 'Poison',
    name: 'SKILL_NAME__POISON',
    description: 'SKILL_DESCRIPTION__POISON',
    icon: 'poison.png',
  },
  {
    id: 'Ranged',
    name: 'SKILL_NAME__RANGED',
    description: 'SKILL_DESCRIPTION__RANGED',
    icon: 'ranged.png',
  },
  {
    id: 'Ride',
    name: 'SKILL_NAME__RIDE',
    description: 'SKILL_DESCRIPTION__RIDE',
    icon: 'ride.png',
  },
  {
    id: 'Shield',
    name: 'SKILL_NAME__SHIELD',
    description: 'SKILL_DESCRIPTION__SHIELD',
    icon: 'shield.png',
    premium: true,
  },
  {
    id: 'Slow',
    name: 'SKILL_NAME__SLOW',
    description: 'SKILL_DESCRIPTION__SLOW',
    icon: 'slow.png',
  },
  {
    id: 'Sprint',
    name: 'SKILL_NAME__SPRINT',
    description: 'SKILL_DESCRIPTION__SPRINT',
    icon: 'sprint.png',
  },
  {
    id: 'Stomp',
    name: 'SKILL_NAME__STOMP',
    description: 'SKILL_DESCRIPTION__STOMP',
    icon: 'stomp.png',
  },
  {
    id: 'Thorns',
    name: 'SKILL_NAME__THORNS',
    description: 'SKILL_DESCRIPTION__THORNS',
    icon: 'thorns.png',
  },
  {
    id: 'Wither',
    name: 'SKILL_NAME__WITHER',
    description: 'SKILL_DESCRIPTION__WITHER',
    icon: 'wither.png',
  }
];
