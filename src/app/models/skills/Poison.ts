import { Upgrade } from "../Upgrade";

export interface Poison extends Upgrade {
  chance?: string;
  duration?: string;
}

export const PoisonDefault = {
  chance: "+0",
  duration: "+0"
} as Poison;
