import { Upgrade } from "../Upgrade";

export interface Slow extends Upgrade {
  chance?: string;
  duration?: string;
}

export const SlowDefault = {
  chance: "+0",
  duration: "+0"
} as Slow;
