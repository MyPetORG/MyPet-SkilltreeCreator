import { Upgrade } from "../Upgrade";

export interface Beacon extends Upgrade {
  range?: string;
  duration?: string;
  count?: string;
  buffs?: {
    Absorption?: {
      active?: null,
      level?: string
    },
    FireResistance?: {
      active?: null,
      level?: string
    },
    Haste?: {
      active?: null,
      level?: string
    },
    HealthBoost?: {
      active?: null,
      level?: string
    },
    JumpBoost?: {
      active?: null,
      level?: string
    },
    Luck?: {
      active?: null,
      level?: string
    },
    NightVision?: {
      active?: null,
      level?: string
    },
    Resistance?: {
      active?: null,
      level?: string
    },
    Speed?: {
      active?: null,
      level?: 1
    },
    Strength?: {
      active?: null,
      level?: string
    },
    WaterBreathing?: {
      active?: null,
      level?: string
    },
  }
}

export const BeaconDefault = {
  range: "+0",
  duration: "+0",
  count: "+0",
  buffs: {
    Absorption: {
      active: null,
      level: "+0"
    },
    FireResistance: {
      active: null,
      level: "+0"
    },
    Haste: {
      active: null,
      level: "+0"
    },
    HealthBoost: {
      active: null,
      level: "+0"
    },
    JumpBoost: {
      active: null,
      level: "+0"
    },
    Luck: {
      active: null,
      level: "+0"
    },
    NightVision: {
      active: null,
      level: "+0"
    },
    Resistance: {
      active: null,
      level: "+0"
    },
    Speed: {
      active: null,
      level: 1
    },
    Strength: {
      active: null,
      level: "+0"
    },
    WaterBreathing: {
      active: null,
      level: "+0"
    },
  }
} as Beacon;
