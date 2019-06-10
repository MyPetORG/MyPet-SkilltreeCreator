import { Upgrade } from '../upgrade';
import { Backpack } from './backpack';
import { Beacon } from './beacon';
import { Behavior } from './behavior';
import { Control } from './control';
import { Damage } from './damage';
import { Fire } from './fire';
import { Heal } from './heal';
import { Knockback } from './knockback';
import { Life } from './life';
import { Lightning } from './lightning';
import { Pickup } from './pickup';
import { Poison } from './poison';
import { Ranged } from './ranged';
import { Ride } from './ride';
import { Shield } from './shield';
import { Slow } from './slow';
import { Sprint } from './sprint';
import { Stomp } from './stomp';
import { Thorns } from './thorns';
import { Wither } from './wither';

type AnyUpgrade = { [name: string]: Upgrade[] };

export type Upgrades = {
  Backpack?: Backpack[],
  Beacon?: Beacon[],
  Behavior?: Behavior[],
  Control?: Control[],
  Damage?: Damage[],
  Fire?: Fire[],
  Heal?: Heal[],
  Knockback?: Knockback[],
  Life?: Life[],
  Lightning?: Lightning[],
  Pickup?: Pickup[],
  Poison?: Poison[],
  Ranged?: Ranged[],
  Ride?: Ride[],
  Shield?: Shield[],
  Slow?: Slow[],
  Sprint?: Sprint[],
  Stomp?: Stomp[],
  Thorns?: Thorns[],
  Wither?: Wither[],
} | AnyUpgrade;
