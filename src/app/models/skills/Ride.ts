import { Upgrade } from "../Upgrade";

export interface Ride extends Upgrade {
  canFly?: boolean | null;
  speed?: string;
  jumpHeight?: string;
}

export const RideDefault = {
  canFly: null,
  speed: "+0",
  jumpHeight: "+0"
} as Ride;
