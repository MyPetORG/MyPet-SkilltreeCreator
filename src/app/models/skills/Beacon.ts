import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Beacon extends Upgrade {
  range?: string;
  duration?: string;
  count?: string;
  buffs?: {
    Absorption?: {
      active?: null | boolean,
      level?: string
    },
    FireResistance?: {
      active?: null | boolean,
      level?: string
    },
    Haste?: {
      active?: null | boolean,
      level?: string
    },
    HealthBoost?: {
      active?: null | boolean,
      level?: string
    },
    JumpBoost?: {
      active?: null | boolean,
      level?: string
    },
    Luck?: {
      active?: null | boolean,
      level?: string
    },
    NightVision?: {
      active?: null | boolean,
      level?: string
    },
    Resistance?: {
      active?: null | boolean,
      level?: string
    },
    Speed?: {
      active?: null | boolean,
      level?: string
    },
    Strength?: {
      active?: null | boolean,
      level?: string
    },
    WaterBreathing?: {
      active?: null | boolean,
      level?: string
    },
  }
}

export class BeaconDefault implements Beacon {
  id = getNewUpgradeID();
  range = "+0";
  duration = "+0";
  count = "+0";
  buffs = {
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
      level: "+0"
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
}

export function BeaconLoader(data: any): Beacon {
  let beacon: Beacon = new BeaconDefault;
  setDefault(beacon, "range", data.range || data.Range);
  setDefault(beacon, "duration", data.duration || data.Duration);
  setDefault(beacon, "count", data.count || data.Count);
  if (data.Buffs) {
    setDefault(beacon.buffs.Absorption, "active", data.Buffs.Absorption ? data.Buffs.Absorption.active : false);
    setDefault(beacon.buffs.Absorption, "level", data.Buffs.Absorption ? data.Buffs.Absorption.level : false);

    setDefault(beacon.buffs.FireResistance, "active", data.Buffs.FireResistance ? data.Buffs.FireResistance.active : false);
    setDefault(beacon.buffs.FireResistance, "level", data.Buffs.FireResistance ? data.Buffs.FireResistance.level : false);

    setDefault(beacon.buffs.Haste, "active", data.Buffs.Haste ? data.Buffs.Haste.active : false);
    setDefault(beacon.buffs.Haste, "level", data.Buffs.Haste ? data.Buffs.Haste.level : false);

    setDefault(beacon.buffs.HealthBoost, "active", data.Buffs.HealthBoost ? data.Buffs.HealthBoost.active : false);
    setDefault(beacon.buffs.HealthBoost, "level", data.Buffs.HealthBoost ? data.Buffs.HealthBoost.level : false);

    setDefault(beacon.buffs.JumpBoost, "active", data.Buffs.JumpBoost ? data.Buffs.JumpBoost.active : false);
    setDefault(beacon.buffs.JumpBoost, "level", data.Buffs.JumpBoost ? data.Buffs.JumpBoost.level : false);

    setDefault(beacon.buffs.Luck, "active", data.Buffs.Luck ? data.Buffs.Luck.active : false);
    setDefault(beacon.buffs.Luck, "level", data.Buffs.Luck ? data.Buffs.Luck.level : false);

    setDefault(beacon.buffs.NightVision, "active", data.Buffs.NightVision ? data.Buffs.NightVision.active : false);
    setDefault(beacon.buffs.NightVision, "level", data.Buffs.NightVision ? data.Buffs.NightVision.level : false);

    setDefault(beacon.buffs.Resistance, "active", data.Buffs.Resistance ? data.Buffs.Resistance.active : false);
    setDefault(beacon.buffs.Resistance, "level", data.Buffs.Resistance ? data.Buffs.Resistance.level : false);

    setDefault(beacon.buffs.Speed, "active", data.Buffs.Speed ? data.Buffs.Speed.active : false);
    setDefault(beacon.buffs.Speed, "level", data.Buffs.Speed ? data.Buffs.Speed.level : false);

    setDefault(beacon.buffs.Strength, "active", data.Buffs.Strength ? data.Buffs.Strength.active : false);
    setDefault(beacon.buffs.Strength, "level", data.Buffs.Strength ? data.Buffs.Strength.level : false);

    setDefault(beacon.buffs.WaterBreathing, "active", data.Buffs.WaterBreathing ? data.Buffs.WaterBreathing.active : false);
    setDefault(beacon.buffs.WaterBreathing, "level", data.Buffs.WaterBreathing ? data.Buffs.WaterBreathing.level : false);
  }

  return beacon;
}
