import { Upgrade } from "../Upgrade";

export interface Control extends Upgrade {
  active?: boolean | null;
}
