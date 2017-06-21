import { Upgrade } from "./Upgrade";

export interface Skill<T extends Upgrade> {
  upgrades: T[];
}
