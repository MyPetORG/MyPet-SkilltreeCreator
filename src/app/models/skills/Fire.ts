import { Upgrade } from "../Upgrade";

export interface Fire extends Upgrade {
  chance?: string;
  duration?: string;
}

export const FireDefault = {
  chance: "+0",
  duration: "+0"
} as Fire;
