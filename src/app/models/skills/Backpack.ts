import { Upgrade } from "../Upgrade";

export interface Backpack extends Upgrade {
  rows?: string;
  drop?: boolean | null;
}

export const BackpackDefault = {
  rows: "+0",
  drop: null
} as Backpack;
