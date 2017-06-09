import { Upgrade } from "../Upgrade";

export interface Beacon extends Upgrade {
  range?: number;
  duration?: number;
  count?: number;
  buffs?: object
  /*
  buffs? = {
    Absorption: {
      active: null,
      level: 1
    },
    FireResistance: {
      active: null,
      level: 1
    },
    Haste: {
      active: null,
      level: 1
    },
    HealthBoost: {
      active: null,
      level: 1
    },
    JumpBoost: {
      active: null,
      level: 1
    },
    Luck: {
      active: null,
      level: 1
    },
    NightVision: {
      active: null,
      level: 1
    },
    Resistance: {
      active: null,
      level: 1
    },
    Speed: {
      active: null,
      level: 1
    },
    Strength: {
      active: null,
      level: 1
    },
    WaterBreathing: {
      active: null,
      level: 1
    },
  }
   */
}
