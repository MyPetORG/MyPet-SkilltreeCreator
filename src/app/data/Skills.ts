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
import { HealthBoost } from "../models/skills/HealthBoost";
import { Pickup } from "../models/skills/Pickup";
import { Ranged } from "../models/skills/Ranged";
import { Shield } from "../models/skills/Shield";

export const Skills = [
  {
    name: 'Backpack',
    description: 'skill.Fire.description',
    icon: 'backpack.png',
    clazz: Backpack
  },
  {
    name: 'Beacon',
    description: 'skill.Beacon.description',
    icon: 'beacon.png',
    clazz: Beacon
  },
  {
    name: 'Behavior',
    description: 'skill.Behavior.description',
    icon: 'behavior.png',
    clazz: Behavior
  },
  {
    name: 'Control',
    description: 'skill.Control.description',
    icon: 'control.png',
    clazz: Control
  },
  {
    name: 'Damage',
    description: 'skill.Damage.description',
    icon: 'damage.png',
    clazz: Control
  },
  {
    name: 'Fire',
    description: 'skill.Fire.description',
    icon: 'fire.png',
    clazz: Fire
  },
  {
    name: 'Heal',
    description: 'skill.Heal.description',
    icon: 'heal.png',
    clazz: Fire
  },
  {
    name: 'Health Boost',
    description: 'skill.HealthBoost.description',
    icon: 'healthboost.png',
    clazz: HealthBoost
  },
  {
    name: 'Knockback',
    description: 'skill.Knockback.description',
    icon: 'knockback.png',
    clazz: Knockback
  },
  {
    name: 'Lightning',
    description: 'skill.Lightning.description',
    icon: 'lightning.png',
    clazz: Lightning
  },
  {
    name: 'Pickup',
    description: 'skill.Pickup.description',
    icon: 'pickup.png',
    clazz: Pickup
  },
  {
    name: 'Poison',
    description: 'skill.Poison.description',
    icon: 'poison.png',
    clazz: Poison
  },
  {
    name: 'Ranged',
    description: 'skill.Ranged.description',
    icon: 'ranged.png',
    clazz: Ranged
  },
  {
    name: 'Ride',
    description: 'skill.Ride.description',
    icon: 'ride.png',
    clazz: Ride
  },
  {
    name: 'Shield',
    description: 'skill.Shield.description',
    icon: 'shield.png',
    clazz: Shield
  },
  {
    name: 'Slow',
    description: 'skill.Slow.description',
    icon: 'slow.png',
    clazz: Slow
  },
  {
    name: 'Sprint',
    description: 'skill.Sprint.description',
    icon: 'sprint.png',
    clazz: Sprint
  },
  {
    name: 'Stomp',
    description: 'skill.Stomp.description',
    icon: 'stomp.png',
    clazz: Stomp
  },
  {
    name: 'Thorns',
    description: 'skill.Thorns.description',
    icon: 'thorns.png',
    clazz: Thorns
  },
  {
    name: 'Wither',
    description: 'skill.Wither.description',
    icon: 'wither.png',
    clazz: Wither
  }
];
