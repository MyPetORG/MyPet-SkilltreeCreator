import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSelectionList, MatSnackBar, MatStepper } from "@angular/material";
import { NbtImportService } from "../../services/nbt-import.service";
import * as Reducers from "../../store/reducers";
import { Store } from "@ngrx/store";
import { Skilltree } from "../../models/Skilltree";
import { Subscription } from "rxjs/Subscription";
import { MobTypes } from "../../data/MobTypes";
import * as SkilltreeActions from "../../store/actions/skilltree";
import { LevelRule } from "../../models/LevelRule";
import { Upgrade } from "../../models/Upgrade";
import { Backpack } from "../../models/skills/Backpack";
import { Behavior } from "../../models/skills/Behavior";
import { Thorns } from "../../models/skills/Thorns";
import { Damage } from "../../models/skills/Damage";
import { Ranged } from "../../models/skills/Ranged";
import { Control } from "../../models/skills/Control";
import { Pickup } from "../../models/skills/Pickup";
import { Sprint } from "../../models/skills/Sprint";
import { Ride } from "../../models/skills/Ride";
import { Slow } from "../../models/skills/Slow";
import { Poison } from "../../models/skills/Poison";
import { Knockback } from "../../models/skills/Knockback";
import { Wither } from "../../models/skills/Wither";
import { Fire } from "../../models/skills/Fire";
import { Lightning } from "../../models/skills/Lightning";
import { Stomp } from "../../models/skills/Stomp";
import { Shield } from "../../models/skills/Shield";
import { Life } from "../../models/skills/Life";
import { Heal } from "../../models/skills/Heal";
import { Beacon, BeaconDefault } from "../../models/skills/Beacon";
import { Router } from "@angular/router";

@Component({
  selector: 'stc-skilltree-import-dialog',
  templateUrl: './skilltree-import-legacy-dialog.component.html',
  styleUrls: ['./skilltree-import-legacy-dialog.component.scss']
})
export class SkilltreeImportLegacyComponent implements OnDestroy, OnInit {

  @ViewChild("stepper") stepper: MatStepper;
  @ViewChild("selectedSkilltreeNames") selectedSkilltreeNames: MatSelectionList;

  stepCompleted: boolean[] = [false, false, false];
  types = [];

  skilltreesSubscription: Subscription;

  nbtData: any = null;
  existingSkilltreeNames: string[];
  newSkilltreeNames: string[];
  selectedNewSkilltreeNames: string[];
  renamedSkilltrees: any = {};

  constructor(public snackBar: MatSnackBar,
              private store: Store<Reducers.State>,
              public importNbt: NbtImportService,
              private router: Router) {
    this.skilltreesSubscription = this.store.select(Reducers.getSkilltreeNames).subscribe((data: string[]) => {
      this.existingSkilltreeNames = data.slice();
    });

    MobTypes.forEach(name => {
      this.types.push({
        name,
        selected: false
      });
    });
  }

  ngOnInit() {
    this.selectedSkilltreeNames.registerOnChange(v => {
      this.selectedNewSkilltreeNames = v.slice();
      this.stepCompleted[1] = this.selectedNewSkilltreeNames.length > 0;
    });
  }

  ngOnDestroy() {
    if (this.skilltreesSubscription) {
      this.skilltreesSubscription.unsubscribe();
    }
  }

  onSelectFile(event) {
    this.stepCompleted[0] = false;
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.importNbt.importFile(file).subscribe(
        data => {
          this.nbtData = data;
          if (this.nbtData != null) {
            this.stepCompleted[0] = true;
            this.loadNewSkilltreeNames();
            this.stepper.next()
          }
        },
        error => {
          this.snackBar.open("This file is not a valid legacy skilltree file.", "Error", {
            duration: 2000,
          });
          console.error(error);
        }
      );
    }
  }

  loadNewSkilltreeNames() {
    if (!this.nbtData) {
      return;
    }
    let data = this.nbtData.value;
    if (data.Skilltrees) {
      let skilltrees: any[] = data.Skilltrees.value.value;

      this.newSkilltreeNames = [];
      this.selectedNewSkilltreeNames = [];
      skilltrees.forEach(skilltree => {
        let oldName = skilltree.Name.value;
        let newName = oldName;
        if (this.existingSkilltreeNames.indexOf(newName) != -1) {
          newName = oldName + "-legacy"
        }
        if (this.existingSkilltreeNames.indexOf(newName) != -1) {
          newName = oldName + "-legacy-" + Date.now();
        }

        this.renamedSkilltrees[oldName] = newName;

        this.newSkilltreeNames.push(newName);
        this.selectedNewSkilltreeNames.push(newName);
      });
    }
  }

  toggleMobType(type) {
    type.selected = !type.selected;
    this.stepCompleted[2] = this.types.filter(t => t.selected).length > 0;
  }

  selectAllMobTypes() {
    this.types.forEach(type => {
      type.selected = true;
    });
    this.stepCompleted[2] = true;
  }

  selectNoneMobTypes() {
    this.types.forEach(type => {
      type.selected = false;
    });
    this.stepCompleted[2] = false;
  }

  done() {
    let mobTypes = [];
    this.types.forEach(type => {
      if (type.selected) {
        mobTypes.push(type.name);
      }
    });
    let data = this.nbtData.value;
    if (data.Skilltrees) {
      let skilltrees: any[] = data.Skilltrees.value.value;
      skilltrees.forEach(skilltreeData => {
        let name = skilltreeData.Name.value;
        let id = this.renamedSkilltrees[name];
        if (this.selectedNewSkilltreeNames.indexOf(id) != -1) {
          console.log(skilltreeData);
          let skilltree: Skilltree = {id, skills: {}, mobtypes: mobTypes.slice()};

          skilltree.order = skilltreeData.Place.value;
          if (skilltreeData.Permission) {
            skilltree.permission = skilltreeData.Permission.value;
          }
          if (skilltreeData.Display) {
            skilltree.name = skilltreeData.Display.value;
          }
          if (skilltreeData.MaxLevel && skilltreeData.MaxLevel.value != 2147483647) {
            skilltree.maxLevel = skilltreeData.MaxLevel.value;
          }
          if (skilltreeData.RequiredLevel) {
            skilltree.requiredLevel = skilltreeData.RequiredLevel.value;
          }
          if (skilltreeData.Description) {
            skilltree.description = skilltreeData.Description.value.value.slice()
          }
          skilltreeData.Level.value.value.forEach(l => {
            let level = l.Level.value;

            l.Skills.value.value.forEach(s => {
              let skillname = s.Name.value;
              if (skillname == "Inventory") {
                skillname = "Backpack";
              }
              if (skillname == "HPregeneration") {
                skillname = "Heal";
              }
              if (skillname == "HP") {
                skillname = "Life";
              }
              if (!skilltree.skills[skillname]) {
                skilltree.skills[skillname] = [];
              }
              let rule: LevelRule = {exact: [level]};
              let upgrade: Upgrade = this.importSkillData(skillname, s.Properties.value);
              upgrade.rule = rule;

              skilltree.skills[skillname].push(upgrade)
            });
          });

          this.store.dispatch(new SkilltreeActions.ImportLegacySkilltreeAction(skilltree));
        }
      });

      this.snackBar.open("Legacy skilltrees imported.", "Skilltree", {
        duration: 2000,
      });
      this.router.navigate(["/"]);
    }
  }

  importSkillData(skillname, skill): Upgrade {
    switch (skillname) {
      case "Beacon": {
        let beacon: Beacon = new BeaconDefault();

        if (skill.range) {
          if (skill.addset_range.value == "add") {
            beacon.range = skill.range.value >= 0 ? "+" + skill.range.value : "" + skill.range.value
          } else {
            beacon.range = "=" + skill.range.value;
          }
        }
        if (skill.duration) {
          if (skill.addset_duration.value == "add") {
            beacon.duration = skill.duration.value >= 0 ? "+" + skill.duration.value : "" + skill.duration.value
          } else {
            beacon.duration = "=" + skill.duration.value;
          }
        }
        if (skill.selection_count) {
          if (skill.addset_selection_count.value == "add") {
            beacon.count = skill.selection_count.value >= 0 ? "+" + skill.selection_count.value : "" + skill.selection_count.value
          } else {
            beacon.count = "=" + skill.selection_count.value;
          }
        }

        let buffs: any = {};
        if (skill.buff_absorption_enable && skill.buff_absorption_level) {
          buffs.Absorption = "=" + skill.buff_absorption_level.value
        }
        if (skill.buff_resistance_enable && skill.buff_resistance_level) {
          buffs.Resistance = "=" + skill.buff_resistance_level.value
        }
        if (skill.buff_jump_boost_enable && skill.buff_jump_boost_level) {
          buffs.JumpBoost = "=" + skill.buff_jump_boost_level.value
        }
        if (skill.buff_strength_enable && skill.buff_strength_level) {
          buffs.Strength = "=" + skill.buff_strength_level.value
        }
        if (skill.buff_haste_enable && skill.buff_haste_level) {
          buffs.Haste = "=" + skill.buff_haste_level.value
        }
        if (skill.buff_speed_boost_enable && skill.buff_speed_boost_level) {
          buffs.Speed = "=" + skill.buff_speed_boost_level.value
        }
        if (skill.buff_luck_enable) {
          buffs.Luck = skill.buff_luck_enable.value;
        }
        if (skill.buff_night_vision_enable) {
          buffs.NightVision = skill.buff_night_vision_enable.value;
        }
        if (skill.buff_invisibility_enable) {
          buffs.NightVision = skill.buff_invisibility_enable.value;
        }
        if (skill.buff_water_breathing_enable) {
          buffs.WaterBreathing = skill.buff_water_breathing_enable.value;
        }
        if (skill.buff_fire_resistance_enable) {
          buffs.FireResistance = skill.buff_fire_resistance_enable.value;
        }
        beacon.buffs = buffs;

        return beacon;
      }
      case "Backpack": {
        let rows = skill.add.value >= 0 ? "+" + skill.add.value : "" + skill.add.value;
        let drop = skill.drop.value == 1;
        return {rows, drop} as Backpack;
      }
      case "Behavior": {
        let aggro = skill.aggro.value == 1;
        let duel = skill.duel.value == 1;
        let farm = skill.farm.value == 1;
        let friend = skill.friend.value == 1;
        let raid = skill.raid.value == 1;
        return {aggro, duel, farm, friend, raid} as Behavior;
      }
      case "Control": {
        let active = true;
        return {active} as Control;
      }
      case "Damage": {
        let damage;
        if (skill.addset_damage.value == "add") {
          damage = skill.damage_double.value >= 0 ? "+" + skill.damage_double.value : "" + skill.damage_double.value
        } else {
          damage = "=" + skill.damage_double.value;
        }
        return {damage} as Damage;
      }
      case "Fire": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        let duration;
        if (skill.addset_duration.value == "add") {
          duration = skill.duration.value >= 0 ? "+" + skill.duration.value : "" + skill.duration.value
        } else {
          duration = "=" + skill.duration.value;
        }
        return {chance, duration} as Fire;
      }
      case "Heal": {
        let health;
        if (skill.addset_hp.value == "add") {
          health = skill.hp_double.value >= 0 ? "+" + skill.hp_double.value : "" + skill.hp_double.value
        } else {
          health = "=" + skill.hp_double.value;
        }
        let timer;
        if (skill.addset_time.value == "add") {
          timer = skill.time.value >= 0 ? "+" + skill.time.value : "" + skill.time.value
        } else {
          timer = "=" + skill.time.value;
        }
        return {health, timer} as Heal;
      }
      case "Life": {
        let health;
        if (skill.addset_hp.value == "add") {
          health = skill.hp_double.value >= 0 ? "+" + skill.hp_double.value : "" + skill.hp_double.value
        } else {
          health = "=" + skill.hp_double.value;
        }
        return {health} as Life;
      }
      case "Knockback": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        return {chance} as Knockback;
      }
      case "Lightning": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        let damage;
        if (skill.addset_damage.value == "add") {
          damage = skill.damage_double.value >= 0 ? "+" + skill.damage_double.value : "" + skill.damage_double.value
        } else {
          damage = "=" + skill.damage_double.value;
        }
        return {chance, damage} as Lightning;
      }
      case "Pickup": {
        let range;
        if (skill.addset_range.value == "add") {
          range = skill.range.value >= 0 ? "+" + skill.range.value : "" + skill.range.value
        } else {
          range = "=" + skill.range.value;
        }
        let exp = skill.exp_pickup.value == 1;
        return {range, exp} as Pickup;
      }
      case "Poison": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        let duration;
        if (skill.addset_duration.value == "add") {
          duration = skill.duration.value >= 0 ? "+" + skill.duration.value : "" + skill.duration.value
        } else {
          duration = "=" + skill.duration.value;
        }
        return {chance, duration} as Poison;
      }
      case "Ranged": {
        let damage;
        if (skill.addset_damage.value == "add") {
          damage = skill.damage_double.value >= 0 ? "+" + skill.damage_double.value : "" + skill.damage_double.value
        } else {
          damage = "=" + skill.damage_double.value;
        }
        let rate;
        if (skill.addset_rateoffire.value == "add") {
          rate = skill.rateoffire.value >= 0 ? "+" + skill.rateoffire.value : "" + skill.rateoffire.value
        } else {
          rate = "=" + skill.rateoffire.value;
        }
        let projectile = skill.projectile.value;
        return {damage, rate, projectile} as Ranged;
      }
      case "Ride": {
        let jumpHeight;
        if (skill.addset_jump_height.value == "add") {
          jumpHeight = skill.jump_height.value >= 0 ? "+" + skill.jump_height.value : "" + skill.jump_height.value
        } else {
          jumpHeight = "=" + skill.jump_height.value;
        }
        let speed;
        if (skill.addset_speed.value == "add") {
          speed = skill.speed_percent.value >= 0 ? "+" + skill.speed_percent.value : "" + skill.speed_percent.value
        } else {
          speed = "=" + skill.speed_percent.value;
        }
        return {jumpHeight, speed} as Ride;
      }
      case "Shield": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        let redirect;
        if (skill.addset_redirection.value == "add") {
          redirect = skill.redirection.value >= 0 ? "+" + skill.redirection.value : "" + skill.redirection.value
        } else {
          redirect = "=" + skill.redirection.value;
        }
        return {chance, redirect} as Shield;
      }
      case "Slow": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        let duration;
        if (skill.addset_duration.value == "add") {
          duration = skill.duration.value >= 0 ? "+" + skill.duration.value : "" + skill.duration.value
        } else {
          duration = "=" + skill.duration.value;
        }
        return {chance, duration} as Slow;
      }
      case "Sprint": {
        let active = true;
        return {active} as Sprint;
      }
      case "Stomp": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        let damage;
        if (skill.addset_damage.value == "add") {
          damage = skill.damage.value >= 0 ? "+" + skill.damage.value : "" + skill.damage.value
        } else {
          damage = "=" + skill.damage.value;
        }
        return {chance, damage} as Stomp;
      }
      case "Thorns": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        let reflection;
        if (skill.addset_reflection.value == "add") {
          reflection = skill.reflection.value >= 0 ? "+" + skill.reflection.value : "" + skill.reflection.value
        } else {
          reflection = "=" + skill.reflection.value;
        }
        return {chance, reflection} as Thorns;
      }
      case "Wither": {
        let chance;
        if (skill.addset_chance.value == "add") {
          chance = skill.chance.value >= 0 ? "+" + skill.chance.value : "" + skill.chance.value
        } else {
          chance = "=" + skill.chance.value;
        }
        let duration;
        if (skill.addset_duration.value == "add") {
          duration = skill.duration.value >= 0 ? "+" + skill.duration.value : "" + skill.duration.value
        } else {
          duration = "=" + skill.duration.value;
        }
        return {chance, duration} as Wither;
      }
    }
    console.log("importSkillData", skillname, skill);
    return {};
  }
}
