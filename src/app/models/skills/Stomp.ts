import { Upgrade } from "../Upgrade";

export interface Stomp extends Upgrade {
  chance?: string;
  damage?: string;
}

export const StompDefault = {
  chance: "+0",
  damage: "+0"
} as Stomp;
