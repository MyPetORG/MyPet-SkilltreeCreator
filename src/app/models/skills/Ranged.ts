import { Upgrade } from "../Upgrade";

export interface Ranged extends Upgrade {
  damage?: string;
  rate?: string;
  projectile?: string | null;
}

export const RangedDefault = {
  damage: "+0",
  rate: "+0",
  projectile: null
} as Ranged;
