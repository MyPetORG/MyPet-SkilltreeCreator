import { Fire } from "../models/skills/Fire";
import { Knockback } from "../models/skills/Knockback";
import { Poison } from "../models/skills/Poison";
import { Lightning } from "../models/skills/Lightning";
import { Ride } from "../models/skills/Ride";
export const Skills = [
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
    clazz: null,
    //clazz: Slow
  },
  {
    name: 'Sprint',
    description: 'skill.Sprint.description',
    icon: 'sprint.png',
    clazz: null,
    //clazz: Sprint
  },
  {
    name: 'Stomp',
    description: 'skill.Stomp.description',
    icon: 'stomp.png',
    clazz: null,
    //clazz: Stomp
  },
  {
    name: 'Thorns',
    description: 'skill.Thorns.description',
    icon: 'thorns.png',
    clazz: null,
    //clazz: Thorns
  },
  {
    name: 'Wither',
    description: 'skill.Wither.description',
    icon: 'wither.png',
    clazz: null,
    //clazz: Wither
  }
];
