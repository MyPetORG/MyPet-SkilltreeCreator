import { Upgrade } from "../Upgrade";

export interface Heal extends Upgrade {
  timer?: number;
  health?: number;
}
