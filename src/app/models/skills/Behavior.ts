import { Upgrade } from "../Upgrade";

export class Behavior extends Upgrade {
  friend: boolean | null = null;
  aggro: boolean | null = null;
  farm: boolean | null = null;
  raid: boolean | null = null;
  duel: boolean | null = null;
}
