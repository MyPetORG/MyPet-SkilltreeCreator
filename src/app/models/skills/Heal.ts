import { Upgrade } from "../Upgrade";

export interface Heal extends Upgrade {
  timer?: string;
  health?: string;
}

export const HealDefault = {
  timer: "+0",
  health: "+0"
} as Heal;
