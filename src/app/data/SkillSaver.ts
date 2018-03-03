import { BackpackSaver } from "../models/skills/Backpack";
import { BehaviorSaver } from "../models/skills/Behavior";
import { ControlSaver } from "../models/skills/Control";
import { SlowSaver } from "../models/skills/Slow";
import { PickupSaver } from "../models/skills/Pickup";
import { RideSaver } from "../models/skills/Ride";
import { KnockbackSaver } from "../models/skills/Knockback";
import { BeaconSaver } from "../models/skills/Beacon";
import { DamageSaver } from "../models/skills/Damage";
import { StompSaver } from "../models/skills/Stomp";
import { FireSaver } from "../models/skills/Fire";
import { ShieldSaver } from "../models/skills/Shield";
import { HealthBoostSaver } from "../models/skills/HealthBoost";
import { PoisonSaver } from "../models/skills/Poison";
import { SprintSaver } from "../models/skills/Sprint";
import { ThornsSaver } from "../models/skills/Thorns";
import { HealSaver } from "../models/skills/Heal";
import { WitherSaver } from "../models/skills/Wither";
import { RangedSaver } from "../models/skills/Ranged";
import { LightningSaver } from "../models/skills/Lightning";

export const SkillSaver = {
  Backpack: BackpackSaver,
  Beacon: BeaconSaver,
  Behavior: BehaviorSaver,
  Control: ControlSaver,
  Damage: DamageSaver,
  Fire: FireSaver,
  Heal: HealSaver,
  HealthBoost: HealthBoostSaver,
  Knockback: KnockbackSaver,
  Lightning: LightningSaver,
  Pickup: PickupSaver,
  Poison: PoisonSaver,
  Ranged: RangedSaver,
  Ride: RideSaver,
  Shield: ShieldSaver,
  Slow: SlowSaver,
  Sprint: SprintSaver,
  Stomp: StompSaver,
  Thorns: ThornsSaver,
  Wither: WitherSaver,
};
