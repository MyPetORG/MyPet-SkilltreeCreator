import { Upgrade } from "../Upgrade";

export interface Shield extends Upgrade {
  chance?: number;
  redirect?: number;
}
