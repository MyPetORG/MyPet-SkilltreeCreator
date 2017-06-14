import { Upgrade } from "../Upgrade";

export interface Thorns extends Upgrade {
  chance?: string;
  reflection?: string;
}

export const ThornsDefault = {
  chance: "+0",
  reflection: "+0"
} as Thorns;
