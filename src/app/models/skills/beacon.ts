import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault } from "../../util/helpers";

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
  beacon.range = matchOrDefault(data.getPropAs("range", "string"), /[+-][0-9]+(\.[0-9]+)?/, "+0");
  beacon.duration = matchOrDefault(data.getPropAs("duration", "string"), /[+-][0-9]+/, "+0");
  beacon.count = matchOrDefault(data.getPropAs("count", "string"), /[+-][0-9]+/, "+0");
  if (data.getProp("buffs")) {
    let buffs = data.getProp("buffs");
    beacon.buffs.absorption = matchOrDefault(buffs.getPropAs("absorption", "string"), /[+-][0-9]+/, "+0");
    beacon.buffs.fireResistance = buffs.getPropAs("fireResistance", "bool|null");
    beacon.buffs.haste = matchOrDefault(buffs.getPropAs("haste", "string"), /[+-][0-9]+/, "+0");
    beacon.buffs.jumpBoost = matchOrDefault(buffs.getPropAs("jumpBoost", "string"), /[+-][0-9]+/, "+0");
    beacon.buffs.luck = buffs.getPropAs("luck", "bool|null");
    beacon.buffs.nightVision = buffs.getPropAs("nightVision", "bool|null");
    beacon.buffs.resistance = matchOrDefault(buffs.getPropAs("resistance", "string"), /[+-][0-9]+/, "+0");
    beacon.buffs.speed = matchOrDefault(buffs.getPropAs("speed", "string"), /[+-][0-9]+/, "+0");
    beacon.buffs.strength = matchOrDefault(buffs.getPropAs("strength", "string"), /[+-][0-9]+/, "+0");
    beacon.buffs.waterBreathing = buffs.getPropAs("waterBreathing", "bool|null");
    beacon.buffs.invisibility = buffs.getPropAs("invisibility", "bool|null");
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
    savedData.Buffs = buffs;
  }

  return savedData;
}
