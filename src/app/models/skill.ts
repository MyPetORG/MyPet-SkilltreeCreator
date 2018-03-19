import { Upgrade } from "./upgrade";

export interface Skill<T extends Upgrade> {
  upgrades: T[];
}
