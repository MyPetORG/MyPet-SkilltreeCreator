import { Upgrade } from "../Upgrade";

export interface Poison extends Upgrade {
  chance?: number;
  duration?: number;
}
