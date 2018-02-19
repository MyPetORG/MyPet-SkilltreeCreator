import { DamageSkillComponent } from "../components/skills/damage-skill/damage-skill.component";
import { SlowSkillComponent } from "../components/skills/slow-skill/slow-skill.component";
import { WitherSkillComponent } from "../components/skills/wither-skill/wither-skill.component";
import { ShieldSkillComponent } from "../components/skills/shield-skill/shield-skill.component";
import { PickupSkillComponent } from "../components/skills/pickup-skill/pickup-skill.component";
import { RideSkillComponent } from "../components/skills/ride-skill/ride-skill.component";
import { HealSkillComponent } from "../components/skills/heal-skill/heal-skill.component";
import { KnockbackSkillComponent } from "../components/skills/knockback-skill/knockback-skill.component";
import { ControlSkillComponent } from "../components/skills/control-skill/control-skill.component";
import { LightningSkillComponent } from "../components/skills/lightning-skill/lightning-skill.component";
import { StompSkillComponent } from "../components/skills/stomp-skill/stomp-skill.component";
import { PoisonSkillComponent } from "../components/skills/poison-skill/poison-skill.component";
import { SprintSkillComponent } from "../components/skills/sprint-skill/sprint-skill.component";
import { BeaconSkillComponent } from "../components/skills/beacon-skill/beacon-skill.component";
import { FireSkillComponent } from "../components/skills/fire-skill/fire-skill.component";
import { BackpackSkillComponent } from "../components/skills/backpack-skill/backpack-skill.component";
import { BehaviorSkillComponent } from "../components/skills/behavior-skill/behavior-skill.component";
import { ThornsSkillComponent } from "../components/skills/thorns-skill/thorns-skill.component";
import { HealthBoostSkillComponent } from "../components/skills/health-boost-skill/health-boost-skill.component";
import { RangedSkillComponent } from "../components/skills/ranged-skill/ranged-skill.component";

export const SkillUpgradeComponents = {
  'Backpack': BackpackSkillComponent,
  'Beacon': BeaconSkillComponent,
  'Behavior': BehaviorSkillComponent,
  'Control': ControlSkillComponent,
  'Damage': DamageSkillComponent,
  'Fire': FireSkillComponent,
  'Heal': HealSkillComponent,
  'Health Boost': HealthBoostSkillComponent,
  'Knockback': KnockbackSkillComponent,
  'Lightning': LightningSkillComponent,
  'Pickup': PickupSkillComponent,
  'Poison': PoisonSkillComponent,
  'Ranged': RangedSkillComponent,
  'Ride': RideSkillComponent,
  'Shield': ShieldSkillComponent,
  'Slow': SlowSkillComponent,
  'Sprint': SprintSkillComponent,
  'Stomp': StompSkillComponent,
  'Thorns': ThornsSkillComponent,
  'Wither': WitherSkillComponent,
};
