import { Upgrade } from "../Upgrade";

export interface Behavior extends Upgrade {
  friend?: boolean | null;
  aggro?: boolean | null;
  farm?: boolean | null;
  raid?: boolean | null;
  duel?: boolean | null;
}
