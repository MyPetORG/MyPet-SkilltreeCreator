import { FireLoader } from "../models/skills/Fire";
import { BehaviorLoader } from "../models/skills/Behavior";
import { BackpackLoader } from "../models/skills/Backpack";
import { ControlLoader } from "../models/skills/Control";
import { DamageLoader } from "../models/skills/Damage";
import { HealLoader } from "../models/skills/Heal";
import { LifeLoader } from "../models/skills/Life";
import { KnockbackLoader } from "../models/skills/Knockback";
import { LightningLoader } from "../models/skills/Lightning";
import { PickupLoader } from "../models/skills/Pickup";
import { PoisonLoader } from "../models/skills/Poison";
import { RangedLoader } from "../models/skills/Ranged";
import { RideLoader } from "../models/skills/Ride";
import { ShieldLoader } from "../models/skills/Shield";
import { SlowLoader } from "../models/skills/Slow";
import { SprintLoader } from "../models/skills/Sprint";
import { StompLoader } from "../models/skills/Stomp";
import { ThornsLoader } from "../models/skills/Thorns";
import { WitherLoader } from "../models/skills/Wither";
import { BeaconLoader } from "../models/skills/Beacon";

export const SkillLoader = {
    Backpack: BackpackLoader,
    Beacon: BeaconLoader,
    Behavior: BehaviorLoader,
    Control: ControlLoader,
    Damage: DamageLoader,
    Fire: FireLoader,
    Heal: HealLoader,
  Life: LifeLoader,
    Knockback: KnockbackLoader,
    Lightning: LightningLoader,
    Pickup: PickupLoader,
    Poison: PoisonLoader,
    Ranged: RangedLoader,
    Ride: RideLoader,
    Shield: ShieldLoader,
    Slow: SlowLoader,
    Sprint: SprintLoader,
    Stomp: StompLoader,
    Thorns: ThornsLoader,
    Wither: WitherLoader,
};
