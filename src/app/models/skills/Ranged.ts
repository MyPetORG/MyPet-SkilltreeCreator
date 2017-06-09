import { Upgrade } from "../Upgrade";

export interface Ranged extends Upgrade {
  damage?: number;
  rate?: number;
  projectile?: string;
}
