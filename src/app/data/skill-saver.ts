import { BackpackSaver } from '../models/skills/backpack';
import { BeaconSaver } from '../models/skills/beacon';
import { BehaviorSaver } from '../models/skills/behavior';
import { ControlSaver } from '../models/skills/control';
import { DamageSaver } from '../models/skills/damage';
import { FireSaver } from '../models/skills/fire';
import { HealSaver } from '../models/skills/heal';
import { KnockbackSaver } from '../models/skills/knockback';
import { LifeSaver } from '../models/skills/life';
import { LightningSaver } from '../models/skills/lightning';
import { PickupSaver } from '../models/skills/pickup';
import { PoisonSaver } from '../models/skills/poison';
import { RangedSaver } from '../models/skills/ranged';
import { RideSaver } from '../models/skills/ride';
import { ShieldSaver } from '../models/skills/shield';
import { SlowSaver } from '../models/skills/slow';
import { SprintSaver } from '../models/skills/sprint';
import { StompSaver } from '../models/skills/stomp';
import { ThornsSaver } from '../models/skills/thorns';
import { WitherSaver } from '../models/skills/wither';

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
