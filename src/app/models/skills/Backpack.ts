import { Upgrade } from "../Upgrade";

export interface Backpack extends Upgrade {
  rows?: number;
  drop?: boolean | null;
}
