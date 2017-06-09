import { Upgrade } from "../Upgrade";

export interface Ride extends Upgrade {
  canFly?: boolean;
  speed?: number;
  jumpHeight?: number;
}
