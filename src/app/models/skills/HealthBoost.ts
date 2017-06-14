import { Upgrade } from "../Upgrade";

export interface HealthBoost extends Upgrade {
  health?: string;
}

export const HealthBoostDefault = {
  health: "+0"
} as HealthBoost;
