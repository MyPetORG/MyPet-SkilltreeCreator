import { Upgrade } from "../Upgrade";

export interface Slow extends Upgrade {
  chance?: number;
  duration?: number;
}
