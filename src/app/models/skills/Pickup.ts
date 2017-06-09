import { Upgrade } from "../Upgrade";

export interface Pickup extends Upgrade {
  range?: number;
  exp?: boolean | null;
}
