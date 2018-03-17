import { getNewUpgradeID, Upgrade } from "../Upgrade";
import { setDefault } from "../../util/helpers";

export interface Beacon extends Upgrade {
  range?: string;
  duration?: string;
  count?: string;
  buffs?: {
    Absorption?: string,
    FireResistance?: null | boolean,
    Haste?: string,
    JumpBoost?: string,
    Luck?: null | boolean,
    NightVision?: null | boolean,
    Resistance?: string,
    Speed?: string,
    Strength?: string,
    WaterBreathing?: null | boolean,
    Invisibility?: null | boolean,
  }
}

export class BeaconDefault implements Beacon {
  id = getNewUpgradeID();
  range = "+0";
  duration = "+0";
  count = "+0";
  buffs = {
    Absorption: "+0",
    FireResistance: null,
    Haste: "+0",
    JumpBoost: "+0",
    Luck: null,
    NightVision: null,
    Resistance: "+0",
    Speed: "+0",
    Strength: "+0",
    WaterBreathing: null,
    Invisibility: null,
  }
}

export function BeaconLoader(data: any): Beacon {
  let beacon: Beacon = new BeaconDefault;
  setDefault(beacon, "range", data.getProp("range"));
  setDefault(beacon, "duration", data.getProp("duration"));
  setDefault(beacon, "count", data.getProp("count"));
  if (data.Buffs) {
    setDefault(beacon.buffs, "Absorption", data.getProp("buffs").getProp("Absorption"));
    setDefault(beacon.buffs, "FireResistance", data.getProp("buffs").getProp("FireResistance"));
    setDefault(beacon.buffs, "Haste", data.getProp("buffs").getProp("Haste"));
    setDefault(beacon.buffs, "JumpBoost", data.getProp("buffs").getProp("JumpBoost"));
    setDefault(beacon.buffs, "Luck", data.getProp("buffs").getProp("Luck"));
    setDefault(beacon.buffs, "NightVision", data.getProp("buffs").getProp("NightVision"));
    setDefault(beacon.buffs, "Resistance", data.getProp("buffs").getProp("Resistance"));
    setDefault(beacon.buffs, "Speed", data.getProp("buffs").getProp("Speed"));
    setDefault(beacon.buffs, "Strength", data.getProp("buffs").getProp("Strength"));
    setDefault(beacon.buffs, "WaterBreathing", data.getProp("buffs").getProp("WaterBreathing"));
    setDefault(beacon.buffs, "Invisibility", data.getProp("buffs").getProp("Invisibility"));
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
  if (data.buffs.Absorption && /[\\+\-]?(\d+)/g.exec(data.buffs.Absorption)[1] != "0") {
    buffs.Absorption = data.buffs.Absorption;
  }
  if (data.buffs.FireResistance != null) {
    buffs.FireResistance = data.buffs.FireResistance;
  }
  if (data.buffs.Haste && /[\\+\-]?(\d+)/g.exec(data.buffs.Haste)[1] != "0") {
    buffs.Haste = data.buffs.Haste;
  }
  if (data.buffs.JumpBoost && /[\\+\-]?(\d+)/g.exec(data.buffs.JumpBoost)[1] != "0") {
    buffs.JumpBoost = data.buffs.JumpBoost;
  }
  if (data.buffs.Luck != null) {
    buffs.Luck = data.buffs.Luck;
  }
  if (data.buffs.NightVision != null) {
    buffs.NightVision = data.buffs.NightVision;
  }
  if (data.buffs.Resistance && /[\\+\-]?(\d+)/g.exec(data.buffs.Resistance)[1] != "0") {
    buffs.Resistance = data.buffs.Resistance;
  }
  if (data.buffs.Speed && /[\\+\-]?(\d+)/g.exec(data.buffs.Speed)[1] != "0") {
    buffs.Speed = data.buffs.Speed;
  }
  if (data.buffs.Strength && /[\\+\-]?(\d+)/g.exec(data.buffs.Strength)[1] != "0") {
    buffs.Strength = data.buffs.Strength;
  }
  if (data.buffs.WaterBreathing != null) {
    buffs.WaterBreathing = data.buffs.WaterBreathing;
  }
  if (data.buffs.Invisibility != null) {
    buffs.Invisibility = data.buffs.Invisibility;
  }

  if (Object.keys(buffs).length > 0) {
    savedData.buffs = buffs;
  }

  return savedData;
}
