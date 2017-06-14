import { Upgrade } from "../Upgrade";

export interface Pickup extends Upgrade {
  range?: string;
  exp?: boolean | null;
}

export const PickupDefault = {
  range: "+0",
  exp: null
} as Pickup;
