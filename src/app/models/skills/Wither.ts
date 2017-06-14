import { Upgrade } from "../Upgrade";

export interface Wither extends Upgrade {
  chance?: string;
  duration?: string;
}

export const WitherDefault = {
  chance: "+0",
  duration: "+0"
} as Wither;
