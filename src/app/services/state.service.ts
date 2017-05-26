import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MobType } from "../models/MobType";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Skilltree } from "../models/Skilltree";
import { Skill } from "../models/Skill";

@Injectable()
export class StateService {
  private _mobType = new BehaviorSubject<MobType>(null);
  readonly mobType: Observable<MobType> = this._mobType.asObservable();

  private _skilltree = new BehaviorSubject<Skilltree>(null);
  readonly skilltree: Observable<Skilltree> = this._skilltree.asObservable();

  private _skill = new BehaviorSubject<Skill>(null);
  readonly skill: Observable<Skill> = this._skill.asObservable();

  public selectMobType(type: MobType) {
    this._mobType.next(type);
    this._skilltree.next(null);
  }

  public selectSkilltree(skilltree: Skilltree) {
    this._skilltree.next(skilltree);
    this._skill.next(null);
  }

  public selectSkill(skill: Skill) {
    this._skill.next(skill);
    console.log("selected NEW")
  }
}
