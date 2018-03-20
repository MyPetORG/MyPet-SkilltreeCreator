import { getNewUpgradeID, Upgrade } from "../upgrade";
import { setDefault } from "../../util/helpers";

export interface Beacon extends Upgrade {
  range?: string;
  duration?: string;
  count?: string;
  buffs?: {
    absorption?: string,
    fireResistance?: null | boolean,
    haste?: string,
    jumpBoost?: string,
    luck?: null | boolean,
    nightVision?: null | boolean,
    resistance?: string,
    speed?: string,
    strength?: string,
    waterBreathing?: null | boolean,
    invisibility?: null | boolean,
  }
}

export class BeaconDefault implements Beacon {
  id = getNewUpgradeID();
  range = "+0";
  duration = "+0";
  count = "+0";
  buffs = {
    absorption: "+0",
    fireResistance: null,
    haste: "+0",
    jumpBoost: "+0",
    luck: null,
    nightVision: null,
    resistance: "+0",
    speed: "+0",
    strength: "+0",
    waterBreathing: null,
    invisibility: null,
  }
}

export function BeaconLoader(data: any): Beacon {
  let beacon: Beacon = new BeaconDefault;
  setDefault(beacon, "range", data.getProp("range"));
  setDefault(beacon, "duration", data.getProp("duration"));
  setDefault(beacon, "count", data.getProp("count"));
  if (data.getProp("buffs")) {
    let buffs = data.getProp("buffs");
    setDefault(beacon.buffs, "absorption", buffs.getProp("absorption"));
    setDefault(beacon.buffs, "fireResistance", buffs.getProp("fireresistance"));
    setDefault(beacon.buffs, "haste", buffs.getProp("haste"));
    setDefault(beacon.buffs, "jumpBoost", buffs.getProp("jumpboost"));
    setDefault(beacon.buffs, "luck", buffs.getProp("luck"));
    setDefault(beacon.buffs, "nightVision", buffs.getProp("nightvision"));
    setDefault(beacon.buffs, "resistance", buffs.getProp("resistance"));
    setDefault(beacon.buffs, "speed", buffs.getProp("speed"));
    setDefault(beacon.buffs, "strength", buffs.getProp("strength"));
    setDefault(beacon.buffs, "waterBreathing", buffs.getProp("waterbreathing"));
    setDefault(beacon.buffs, "invisibility", buffs.getProp("invisibility"));
  }
  return beacon;
}

export function BeaconSaver(data: Beacon) {
  let savedData: any = {};
  if (data.range && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.range)[1] != "0") {
    savedData.Range = data.range;
  }
  if (data.duration && /[\\+\-]?(\d+)/g.exec(data.duration)[1] != "0") {
    savedData.Duration = data.duration;
  }
  if (data.count && /[\\+\-]?(\d+)/g.exec(data.count)[1] != "0") {
    savedData.Count = data.count;
  }

  let buffs: any = {};
  if (data.buffs.absorption && /[\\+\-]?(\d+)/g.exec(data.buffs.absorption)[1] != "0") {
    buffs.Absorption = data.buffs.absorption;
  }
  if (data.buffs.fireResistance != null) {
    buffs.FireResistance = data.buffs.fireResistance;
  }
  if (data.buffs.haste && /[\\+\-]?(\d+)/g.exec(data.buffs.haste)[1] != "0") {
    buffs.Haste = data.buffs.haste;
  }
  if (data.buffs.jumpBoost && /[\\+\-]?(\d+)/g.exec(data.buffs.jumpBoost)[1] != "0") {
    buffs.JumpBoost = data.buffs.jumpBoost;
  }
  if (data.buffs.luck != null) {
    buffs.Luck = data.buffs.luck;
  }
  if (data.buffs.nightVision != null) {
    buffs.NightVision = data.buffs.nightVision;
  }
  if (data.buffs.resistance && /[\\+\-]?(\d+)/g.exec(data.buffs.resistance)[1] != "0") {
    buffs.Resistance = data.buffs.resistance;
  }
  if (data.buffs.speed && /[\\+\-]?(\d+)/g.exec(data.buffs.speed)[1] != "0") {
    buffs.Speed = data.buffs.speed;
  }
  if (data.buffs.strength && /[\\+\-]?(\d+)/g.exec(data.buffs.strength)[1] != "0") {
    buffs.Strength = data.buffs.strength;
  }
  if (data.buffs.waterBreathing != null) {
    buffs.WaterBreathing = data.buffs.waterBreathing;
  }
  if (data.buffs.invisibility != null) {
    buffs.Invisibility = data.buffs.invisibility;
  }

  if (Object.keys(buffs).length > 0) {
    savedData.buffs = buffs;
  }

  return savedData;
}
