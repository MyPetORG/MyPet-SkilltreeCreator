import { getNewUpgradeID, Upgrade } from "../upgrade";
import { matchOrDefault } from "../../util/helpers";

export const Projectiles: string[] = [
  "Arrow",
  "Snowball",
  "Fireball",
  "LargeFireball",
  "WitherSkull",
  "Egg",
  "DragonFireball",
  "Trident",
  "EnderPearl",
  "LlamaSpit",
];

export interface Ranged extends Upgrade {
  damage?: string;
  rate?: string;
  projectile?: string | null;
}

export class RangedDefault implements Ranged {
  id = getNewUpgradeID();
  damage = "+0";
  rate = "+0";
  projectile = null;
}

export function RangedLoader(data: any): Ranged {
  let ranged: Ranged = Object.assign({}, new RangedDefault);
  ranged.damage = matchOrDefault(data.getPropAs("damage", "string"), /[+-][0-9]+(\.[0-9]+)?/, "+0");
  ranged.rate = matchOrDefault(data.getPropAs("rate", "string"), /[+-][0-9]+(\.[0-9]+)?/, "+0");
  let projectile = data.getPropAs("projectile", "string");
  if (projectile) {
    projectile = projectile.toLowerCase();
    Projectiles.forEach(p => {
      if (p.toLowerCase() == projectile) {
        ranged.projectile = p;
      }
    });
  }
  return ranged;
}

export function RangedSaver(data: Ranged) {
  let savedData: any = {};
  if (data.damage && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.damage)[1] != "0") {
    savedData.Damage = data.damage;
  }
  if (data.rate && /[\\+\-]?(\d+(?:\.\d+)?)/g.exec(data.rate)[1] != "0") {
    savedData.Rate = data.rate;
  }
  if (data.projectile) {
    savedData.Projectile = data.projectile;
  }
  return savedData;
}
