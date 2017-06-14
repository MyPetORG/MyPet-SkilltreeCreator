import { Upgrade } from "../Upgrade";

export interface Knockback extends Upgrade {
  chance?: string;
}

export const KnockbackDefault = {
  chance: "+0"
} as Knockback;
