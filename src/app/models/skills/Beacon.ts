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
  setDefault(beacon, "range", data.getProp("range"));
  setDefault(beacon, "duration", data.getProp("duration"));
  setDefault(beacon, "count", data.getProp("count"));
  if (data.Buffs) {
    setDefault(beacon.buffs.Absorption, "active", data.getProp("buffs").getProp("Absorption") ? data.getProp("buffs").getProp("Absorption").getProp("active") : null);
    setDefault(beacon.buffs.Absorption, "level", data.getProp("buffs").getProp("Absorption") ? data.getProp("buffs").getProp("Absorption").getProp("level") : "+0");

    setDefault(beacon.buffs.FireResistance, "active", data.getProp("buffs").getProp("FireResistance") ? data.getProp("buffs").getProp("FireResistance").getProp("active") : null);
    setDefault(beacon.buffs.FireResistance, "level", data.getProp("buffs").getProp("FireResistance") ? data.getProp("buffs").getProp("FireResistance").getProp("level") : "+0");

    setDefault(beacon.buffs.Haste, "active", data.getProp("buffs").getProp("Haste") ? data.getProp("buffs").getProp("Haste").getProp("active") : null);
    setDefault(beacon.buffs.Haste, "level", data.getProp("buffs").getProp("Haste") ? data.getProp("buffs").getProp("Haste").getProp("level") : "+0");

    setDefault(beacon.buffs.HealthBoost, "active", data.getProp("buffs").getProp("HealthBoost") ? data.getProp("buffs").getProp("HealthBoost").getProp("active") : null);
    setDefault(beacon.buffs.HealthBoost, "level", data.getProp("buffs").getProp("HealthBoost") ? data.getProp("buffs").getProp("HealthBoost").getProp("level") : "+0");

    setDefault(beacon.buffs.JumpBoost, "active", data.getProp("buffs").getProp("JumpBoost") ? data.getProp("buffs").getProp("JumpBoost").getProp("active") : null);
    setDefault(beacon.buffs.JumpBoost, "level", data.getProp("buffs").getProp("JumpBoost") ? data.getProp("buffs").getProp("JumpBoost").getProp("level") : "+0");

    setDefault(beacon.buffs.Luck, "active", data.getProp("buffs").getProp("Luck") ? data.getProp("buffs").getProp("Luck").getProp("active") : null);
    setDefault(beacon.buffs.Luck, "level", data.getProp("buffs").getProp("Luck") ? data.getProp("buffs").getProp("Luck").getProp("level") : "+0");

    setDefault(beacon.buffs.NightVision, "active", data.getProp("buffs").getProp("NightVision") ? data.getProp("buffs").getProp("NightVision").getProp("active") : null);
    setDefault(beacon.buffs.NightVision, "level", data.getProp("buffs").getProp("NightVision") ? data.getProp("buffs").getProp("NightVision").getProp("level") : "+0");

    setDefault(beacon.buffs.Resistance, "active", data.getProp("buffs").getProp("Resistance") ? data.getProp("buffs").getProp("Resistance").getProp("active") : null);
    setDefault(beacon.buffs.Resistance, "level", data.getProp("buffs").getProp("Resistance") ? data.getProp("buffs").getProp("Resistance").getProp("level") : "+0");

    setDefault(beacon.buffs.Speed, "active", data.getProp("buffs").getProp("Speed") ? data.getProp("buffs").getProp("Speed").getProp("active") : null);
    setDefault(beacon.buffs.Speed, "level", data.getProp("buffs").getProp("Speed") ? data.getProp("buffs").getProp("Speed").getProp("level") : "+0");

    setDefault(beacon.buffs.Strength, "active", data.getProp("buffs").getProp("Strength") ? data.getProp("buffs").getProp("Strength").getProp("active") : null);
    setDefault(beacon.buffs.Strength, "level", data.getProp("buffs").getProp("Strength") ? data.getProp("buffs").getProp("Strength").getProp("level") : "+0");

    setDefault(beacon.buffs.WaterBreathing, "active", data.getProp("buffs").getProp("WaterBreathing") ? data.getProp("buffs").getProp("WaterBreathing").getProp("active") : null);
    setDefault(beacon.buffs.WaterBreathing, "level", data.getProp("buffs").getProp("WaterBreathing") ? data.getProp("buffs").getProp("WaterBreathing").getProp("level") : "+0");
  }

  return beacon;
}
