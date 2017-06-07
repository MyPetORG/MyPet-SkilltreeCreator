import { Upgrade } from "./Upgrade";

export class Skill<T extends Upgrade> {
  upgrades: T[] = [];
}
