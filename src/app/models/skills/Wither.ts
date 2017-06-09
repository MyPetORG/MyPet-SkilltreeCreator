import { Upgrade } from "../Upgrade";

export interface Wither extends Upgrade {
  chance?: number;
  duration?: number;
}
