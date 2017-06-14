import { Upgrade } from "../Upgrade";

export interface Control extends Upgrade {
  active?: boolean | null;
}

export const ControlDefault = {
  active: null
}as Control;
