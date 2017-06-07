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

export const Skills = [
  {
    name: 'Beacon',
    description: 'skill.Beacon.description',
    icon: 'beacon.png',
    clazz: Beacon
  },
  {
    name: 'Fire',
    description: 'skill.Fire.description',
    icon: 'fire.png',
    clazz: Fire
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
    name: 'Poison',
    description: 'skill.Poison.description',
    icon: 'poison.png',
    clazz: Poison
  },
  {
    name: 'Ride',
    description: 'skill.Ride.description',
    icon: 'ride.png',
    clazz: Ride
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
