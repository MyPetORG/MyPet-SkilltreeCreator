import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MobType } from "../models/MobType";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Skilltree } from "../models/Skilltree";
import { Skill } from "../models/Skill";

@Injectable()
export class SelectionService {
  private _selectedMobType = new BehaviorSubject<MobType>(null);
  readonly selectedMobType: Observable<MobType> = this._selectedMobType.asObservable();

  private _selectedSkilltree = new BehaviorSubject<Skilltree>(null);
  readonly selectedSkilltree: Observable<Skilltree> = this._selectedSkilltree.asObservable();

  private _selectedSkill = new BehaviorSubject<Skill>(null);
  readonly selectedSkill: Observable<Skill> = this._selectedSkill.asObservable();

  public selectMobType(type: MobType) {
    this._selectedMobType.next(type);
    this._selectedSkilltree.next(null);
  }

  public selectSkilltree(skilltree: Skilltree) {
    this._selectedSkilltree.next(skilltree)
    this._selectedSkill.next(null);
  }

  public selectSkill(skill: Skill) {
    this._selectedSkill.next(skill)
  }
}
