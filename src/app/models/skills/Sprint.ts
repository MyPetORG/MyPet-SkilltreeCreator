import { Upgrade } from "../Upgrade";

export interface Sprint extends Upgrade {
  active?: boolean | null;
}
