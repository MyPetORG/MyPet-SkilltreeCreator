import { Upgrade } from "../Upgrade";

export interface Lightning extends Upgrade {
  chance?: string;
  damage?: string;
}

export const LightningDefault = {
  chance: "+0",
  damage: "+0"
} as Lightning;
