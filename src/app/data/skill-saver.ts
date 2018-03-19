import { BackpackSaver } from "../models/skills/backpack";
import { BehaviorSaver } from "../models/skills/behavior";
import { ControlSaver } from "../models/skills/control";
import { SlowSaver } from "../models/skills/slow";
import { PickupSaver } from "../models/skills/pickup";
import { RideSaver } from "../models/skills/ride";
import { KnockbackSaver } from "../models/skills/knockback";
import { BeaconSaver } from "../models/skills/beacon";
import { DamageSaver } from "../models/skills/damage";
import { StompSaver } from "../models/skills/stomp";
import { FireSaver } from "../models/skills/fire";
import { ShieldSaver } from "../models/skills/shield";
import { LifeSaver } from "../models/skills/life";
import { PoisonSaver } from "../models/skills/poison";
import { SprintSaver } from "../models/skills/sprint";
import { ThornsSaver } from "../models/skills/thorns";
import { HealSaver } from "../models/skills/heal";
import { WitherSaver } from "../models/skills/wither";
import { RangedSaver } from "../models/skills/ranged";
import { LightningSaver } from "../models/skills/lightning";

export const SkillSaver = {
  Backpack: BackpackSaver,
  Beacon: BeaconSaver,
  Behavior: BehaviorSaver,
  Control: ControlSaver,
  Damage: DamageSaver,
  Fire: FireSaver,
  Heal: HealSaver,
  Life: LifeSaver,
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
