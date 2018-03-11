import { Fire } from "../models/skills/Fire";
import { Knockback } from "../models/skills/Knockback";
import { Poison } from "../models/skills/Poison";
import { Lightning } from "../models/skills/Lightning";
import { Ride } from "../models/skills/Ride";
import { Slow } from "../models/skills/Slow";
import { Sprint } from "../models/skills/Sprint";
import { Stomp } from "../models/skills/Stomp";
import { Thorns } from "../models/skills/Thorns";
import { Wither } from "../models/skills/Wither";
import { Beacon } from "app/models/skills/Beacon";
import { Backpack } from "../models/skills/Backpack";
import { Behavior } from "../models/skills/Behavior";
import { Control } from "app/models/skills/Control";
import { Pickup } from "../models/skills/Pickup";
import { Ranged } from "../models/skills/Ranged";
import { Shield } from "../models/skills/Shield";

export interface SkillInfo {
  id: string,
  name: string,
  description: string,
  icon: string,
}

export const Skills: SkillInfo[] = [
  {
    id: 'Backpack',
    name: 'skill.Fire.name',
    description: 'skill.Fire.description',
    icon: 'backpack.png',
  },
  {
    id: 'Beacon',
    name: 'skill.Beacon.name',
    description: 'skill.Beacon.description',
    icon: 'beacon.png',
  },
  {
    id: 'Behavior',
    name: 'skill.Behavior.name',
    description: 'skill.Behavior.description',
    icon: 'behavior.png',
  },
  {
    id: 'Control',
    name: 'skill.Control.name',
    description: 'skill.Control.description',
    icon: 'control.png',
  },
  {
    id: 'Damage',
    name: 'skill.Damage.name',
    description: 'skill.Damage.description',
    icon: 'damage.png',
  },
  {
    id: 'Fire',
    name: 'skill.Fire.name',
    description: 'skill.Fire.description',
    icon: 'fire.png',
  },
  {
    id: 'Heal',
    name: 'skill.Heal.name',
    description: 'skill.Heal.description',
    icon: 'heal.png',
  },
  {
    id: 'Life',
    name: 'skill.Life.name',
    description: 'skill.Life.description',
    icon: 'life.png',
  },
  {
    id: 'Knockback',
    name: 'skill.Knockback.name',
    description: 'skill.Knockback.description',
    icon: 'knockback.png',
  },
  {
    id: 'Lightning',
    name: 'skill.Lightning.name',
    description: 'skill.Lightning.description',
    icon: 'lightning.png',
  },
  {
    id: 'Pickup',
    name: 'skill.Pickup.name',
    description: 'skill.Pickup.description',
    icon: 'pickup.png',
  },
  {
    id: 'Poison',
    name: 'skill.Poison.name',
    description: 'skill.Poison.description',
    icon: 'poison.png',
  },
  {
    id: 'Ranged',
    name: 'skill.Ranged.name',
    description: 'skill.Ranged.description',
    icon: 'ranged.png',
  },
  {
    id: 'Ride',
    name: 'skill.Ride.name',
    description: 'skill.Ride.description',
    icon: 'ride.png',
  },
  {
    id: 'Shield',
    name: 'skill.Shield.name',
    description: 'skill.Shield.description',
    icon: 'shield.png',
  },
  {
    id: 'Slow',
    name: 'skill.Slow.name',
    description: 'skill.Slow.description',
    icon: 'slow.png',
  },
  {
    id: 'Sprint',
    name: 'skill.Sprint.name',
    description: 'skill.Sprint.description',
    icon: 'sprint.png',
  },
  {
    id: 'Stomp',
    name: 'skill.Stomp.name',
    description: 'skill.Stomp.description',
    icon: 'stomp.png',
  },
  {
    id: 'Thorns',
    name: 'skill.Thorns.name',
    description: 'skill.Thorns.description',
    icon: 'thorns.png',
  },
  {
    id: 'Wither',
    name: 'skill.Wither.name',
    description: 'skill.Wither.description',
    icon: 'wither.png',
  }
];
