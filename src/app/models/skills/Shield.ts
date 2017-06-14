import { Upgrade } from "../Upgrade";

export interface Shield extends Upgrade {
  chance?: string;
  redirect?: string;
}

export const ShieldDefault = {
  chance: "+0",
  redirect: "+0"
} as Shield;
