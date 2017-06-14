import { Upgrade } from "../Upgrade";

export interface Damage extends Upgrade {
  damage?: string;
}

export const DamageDefault = {
  damage: "+0"
} as Damage;
